import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import kale_salad from '$lib/contracts/kale_salad';
import { rpc } from '$lib/passkeyClient';
import { Contract, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';

export const GET: RequestHandler = async ({ fetch }) => {
    const saladContract = new Contract(kale_salad.options.contractId);

    const instance: Record<string, any> = {};
    const { entries: instanceEntries } = await rpc.getLedgerEntries(saladContract.getFootprint());

    instanceEntries.forEach((entry) => {
        switch (entry.val.contractData().key().switch().value) {
            case xdr.ScValType.scvLedgerKeyContractInstance().value:
                entry.val
                    .contractData()
                    .val()
                    .instance()
                    .storage()!
                    .forEach((iEntry) => {
                        const key = scValToNative(iEntry.key())[0].toString();
                        const value = scValToNative(iEntry.val());
                        instance[key] = value;
                    });
                break;
        }
    });

    const ledgerKeyArray = [];
    for (let i = 0; i <= instance.MintIndex; i++) {
        ledgerKeyArray.push(
            xdr.LedgerKey.contractData(
                new xdr.LedgerKeyContractData({
                    contract: saladContract.address().toScAddress(),
                    key: nativeToScVal([
                        nativeToScVal('Owner', { type: 'symbol' }),
                        nativeToScVal(i, { type: 'u32' }),
                    ]),
                    durability: xdr.ContractDataDurability.persistent(),
                }),
            ),
        );
    }

    const { entries: ownerEntries } = await rpc.getLedgerEntries(...ledgerKeyArray);
    const mintedNfts: Promise<Record<string, any>[]> = Promise.all(
        ownerEntries.map(async (entry) => {
            const nftObj = {
                tokenId: scValToNative(entry.key.contractData().key())[1],
                owner: scValToNative(entry.val.contractData().val()),
                meta: {},
            };

            const tokenUri = `${instance.Metadata.base_uri}${nftObj.tokenId}`;
            const results = await fetch(tokenUri.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/'));

            if (results.ok) {
                const jso = await results.json();
                nftObj.meta = jso;
            }

            return nftObj;
        }),
    );

    return json({
        pricePerNft: instance.PaymentPerNft.toString(),
        mintIndex: instance.MintIndex,
        maxToMint: 250,
        baseUri: instance.Metadata.base_uri,
        mintedNfts: await mintedNfts,
    });
};
