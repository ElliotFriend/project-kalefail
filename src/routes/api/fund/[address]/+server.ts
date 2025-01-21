import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import { PRIVATE_FUNDER_SECRET_KEY } from '$env/static/private';

import { error, json } from '@sveltejs/kit';
import { Keypair } from '@stellar/stellar-sdk';
import { basicNodeSigner } from '@stellar/stellar-sdk/contract';

import type { RequestHandler } from './$types';
import { native, send } from '$lib/passkeyClient';

/**
 * Sends some Testnet XLM to a contract.
 *
 * @remarks
 *
 * Since Friendbot doesn't work with `C...` contract addresses, this is just one
 * of many possible ways to get the deployed smart wallets some Testnet funds to
 * play with. We simply have a funded account on Testnet, and are using that to
 * invoke the native XLM SAC contract's `transfer` function.
 *
 * @param address - The contract address to fund on the Testnet
 */
export const GET: RequestHandler = async ({ params, fetch }) => {
    const fundKeypair = Keypair.fromSecret(PRIVATE_FUNDER_SECRET_KEY);
    const fundSigner = basicNodeSigner(fundKeypair, PUBLIC_STELLAR_NETWORK_PASSPHRASE);

    try {
        const { built, ...transfer } = await native.transfer({
            from: fundKeypair.publicKey(),
            to: params.address,
            amount: BigInt(25 * 10_000_000),
        });

        await transfer.signAuthEntries({
            address: fundKeypair.publicKey(),
            signAuthEntry: fundSigner.signAuthEntry,
        });

        await fetch('/api/send', {
            method: 'POST',
            body: JSON.stringify({
                xdr: built!.toXDR(),
            }),
        });

        return json({
            status: 200,
            message: 'Smart wallet successfully funded',
        });
    } catch (err) {
        console.error(err);
        error(500, {
            message: 'Server error when funding contract',
        });
    }
};
