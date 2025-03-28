import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import kale_salad from '$lib/contracts/kale_salad';
import { rpc } from '$lib/passkeyClient';
import { Contract, nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';

export const GET: RequestHandler = async ({ fetch }) => {
    const saladContract = new Contract(kale_salad.options.contractId);

    let instance: Record<string, any> = {};
    let { entries: instanceEntries } = await rpc.getLedgerEntries(saladContract.getFootprint());

    instanceEntries.forEach((entry) => {
        switch (entry.val.contractData().key().switch().value) {
            case xdr.ScValType.scvLedgerKeyContractInstance().value:
                let instanceStorage = entry.val.contractData().val().instance().storage();
                instanceStorage!.forEach((iEntry) => {
                    let key = scValToNative(iEntry.key())[0].toString();
                    let value = scValToNative(iEntry.val());
                    instance[key] = value;
                });
                break;
        }
    });

    let ledgerKeyArray = [];
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

    let { entries: ownerEntries } = await rpc.getLedgerEntries(...ledgerKeyArray);
    let mintedNfts: Promise<Record<string, any>[]> = Promise.all(
        ownerEntries.map(async (entry) => {
            let nftObj = {
                tokenId: scValToNative(entry.key.contractData().key())[1],
                owner: scValToNative(entry.val.contractData().val()),
                meta: {},
            };

            const tokenUri = `${instance.Metadata.base_uri}${nftObj.tokenId}`;
            let results = await fetch(tokenUri.replace(/^ipfs\:\/\//, 'https://ipfs.io/ipfs/'));

            if (results.ok) {
                let jso = await results.json();
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
