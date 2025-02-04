import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Keypair, TransactionBuilder } from '@stellar/stellar-sdk';
import { PRIVATE_FAIL_WALLET_DEPLOYER_SECRET } from '$env/static/private';
import { PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import { AssembledTransaction } from '@stellar/stellar-sdk/contract';

/**
 * Signs a deploy transaction using the configured deployer keypair.
 *
 * @param xdr - The base64-encoded transaction. This transaction **must**
 * contain a Soroban operation.
 * @returns JSON object containing the RPC's response.
 */
export const POST: RequestHandler = async ({ request, url }) => {
    if (request.headers.get('referer')?.includes(url.origin)) {
        const deployerKp = Keypair.fromSecret(PRIVATE_FAIL_WALLET_DEPLOYER_SECRET)
        const { xdr } = await request.json();

        const tx = TransactionBuilder.fromXDR(xdr, PUBLIC_STELLAR_NETWORK_PASSPHRASE)
        tx.sign(deployerKp)

        return json({ signedTxXdr: tx.toXDR() });
    } else {
        error(403, { message: 'hostname mismatch' });
    }
};
