import { kaleSacAddress, rpc } from '$lib/passkeyClient';
import { xdr, Address, Contract, scValToNative, nativeToScVal, Asset } from '@stellar/stellar-sdk';
import type { LayoutServerLoad } from './$types';
import trading_post from '$lib/contracts/trading_post';
// import type { Storage } from 'trading_post';
import type { VegetableAsset } from '$lib/types';
import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';

export const load: LayoutServerLoad = async ({ depends }) => {
    const tradingPostContract = new Contract(trading_post.options.contractId);

    const returnObj: {instance: Record<string, any>; contractKale: number; vegetables: VegetableAsset[]} = {
        instance: {},
        contractKale: 0,
        vegetables: [],
    };

    const tpKaleBalanceKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(kaleSacAddress).toScAddress(),
            durability: xdr.ContractDataDurability.persistent(),
            key: xdr.ScVal.scvVec([
                nativeToScVal('Balance', { type: 'symbol' }),
                tradingPostContract.address().toScVal(),
            ]),
        }),
    );

    const { entries } = await rpc.getLedgerEntries(
        tradingPostContract.getFootprint(),
        tpKaleBalanceKey,
    );

    entries.forEach((entry) => {
        switch (entry.val.contractData().key().switch().value) {
            case xdr.ScValType.scvLedgerKeyContractInstance().value:
                // trading post contract instance storage
                entry.val.contractData().val().instance().storage()!
                    .forEach((iEntry) => {
                        const key = scValToNative(iEntry.key())[0].toString();
                        const value = scValToNative(iEntry.val());
                        returnObj.instance[key] = value;
                    });
                break;
            default:
                // the KALE balance held by the trading post
                returnObj.contractKale = scValToNative(entry.val.contractData().val()).amount;
        }
    });

    const vegetableFootprints = returnObj.instance.Vegetables.map((v: string) => {
        return new Contract(v).getFootprint();
    });
    const { entries: vegetablesMeta } = await rpc.getLedgerEntries(...vegetableFootprints);
    vegetablesMeta.forEach((vegetableMeta) => {
        if (
            vegetableMeta.val.contractData().key().switch().value ===
            xdr.ScValType.scvLedgerKeyContractInstance().value
        ) {
            const instanceStorage = vegetableMeta.val.contractData().val().instance().storage();
            instanceStorage!.forEach((iEntry) => {
                if (iEntry.key().switch().value === xdr.ScValType.scvSymbol().value) {
                    // the "METADATA" instance storage entries for a SAC
                    const nameEntry = iEntry
                        .val()
                        .map()
                        ?.find((t) => t.key().sym().toString() === 'name');
                    const [assetCode, assetIssuer] = scValToNative(nameEntry!.val()).split(':');
                    const vegeAsset: VegetableAsset = {
                        assetCode,
                        issuerAddress: assetIssuer,
                        contractAddress: new Asset(assetCode, assetIssuer).contractId(
                            PUBLIC_STELLAR_NETWORK_PASSPHRASE,
                        ),
                    };
                    returnObj.vegetables.push(vegeAsset);
                }
            });
        }
    });

    depends('kf:trading-post:status');

    return returnObj;
};
