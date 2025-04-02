import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { rpc } from '$lib/passkeyClient';
import { Contract, scValToNative, xdr, Address, nativeToScVal } from '@stellar/stellar-sdk';

function createPailLedgerKeys(index: number, address: string): xdr.LedgerKey[] {
    return Array.from({ length: 200 }, (_, i) => index - i).map((p) =>
        xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: new Address(
                    'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
                ).toScAddress(),
                key: nativeToScVal([
                    nativeToScVal('Pail', { type: 'symbol' }),
                    nativeToScVal(address, { type: 'address' }),
                    nativeToScVal(p, { type: 'u32' }),
                ]),
                durability: xdr.ContractDataDurability.temporary(),
            }),
        ),
    );
}

export const GET: RequestHandler = async ({ params }) => {
    if (!params.address) {
        error(400, { message: 'address required for tractor hunt.' });
    }

    let kaleContract = new Contract('CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA');
    let { entries: instanceEntries } = await rpc.getLedgerEntries(kaleContract.getFootprint());
    let farmIndex = instanceEntries[0].val
        .contractData()
        .val()
        .instance()
        .storage()
        ?.find((e) => scValToNative(e.key())[0] === 'FarmIndex');
    let searchIndex = farmIndex ? scValToNative(farmIndex?.val()) - 1 : 0;

    if (searchIndex === 0) {
        error(500, 'Could not find current KALE block. Please try again later');
    }

    // search one batch of 200 pails
    let possiblePails = createPailLedgerKeys(searchIndex, params.address);
    let { entries: pailEntries1 } = await rpc.getLedgerEntries(...possiblePails);

    // search for the next batch of 200 pails
    possiblePails = createPailLedgerKeys(searchIndex - 200, params.address);
    let { entries: pailEntries2, latestLedger } = await rpc.getLedgerEntries(...possiblePails);

    // mash the two together
    let pailEntries = [...pailEntries1, ...pailEntries2];

    let harvestablePails = pailEntries.map((e) => {
        let pail = scValToNative(e.val.contractData().val());
        if (
            e.liveUntilLedgerSeq &&
            e.liveUntilLedgerSeq >= latestLedger &&
            pail.gap &&
            pail.zeros
        ) {
            return e.key.contractData().key().vec()?.[2].u32();
        }
    });

    return json({
        index: searchIndex,
        pails: harvestablePails.filter((p) => p),
    });
};
