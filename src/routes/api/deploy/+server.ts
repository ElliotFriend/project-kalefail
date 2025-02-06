import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Keypair, hash } from '@stellar/stellar-sdk';
import { PRIVATE_FAIL_WALLET_DEPLOYER_SECRET } from '$env/static/private';
import {
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_WALLET_WASM_HASH,
} from '$env/static/public';
import { basicNodeSigner } from '@stellar/stellar-sdk/contract';
import { PasskeyClient } from 'passkey-kit';
import { server } from '$lib/server/passkeyServer';

/**
 * Signs a deploy transaction using the configured deployer keypair.
 *
 * @param id - The base64-encoded passkey ID.
 * @param pk - The base64-encoded passkey public key.
 * @returns JSON object containing the newly deployed contract ID.
 */
export const GET: RequestHandler = async ({ request, url }) => {
    const id = url.searchParams.get('id')?.toString();
    const pk = url.searchParams.get('pk')?.toString();

    if (!id || !pk) {
        error(400, { message: 'passkey id and public key are required' });
    }

    if (!request.headers.get('referer')?.includes(url.origin)) {
        error(403, { message: 'hostname mismatch' });
    }

    const deployerKp = Keypair.fromSecret(PRIVATE_FAIL_WALLET_DEPLOYER_SECRET);
    const at = await PasskeyClient.deploy(
        {
            signer: {
                tag: 'Secp256r1',
                values: [
                    Buffer.from(id, 'base64'),
                    Buffer.from(pk, 'base64'),
                    [undefined],
                    [undefined],
                    { tag: 'Persistent', values: undefined },
                ],
            },
        },
        {
            rpcUrl: PUBLIC_STELLAR_RPC_URL,
            wasmHash: PUBLIC_WALLET_WASM_HASH,
            networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            publicKey: deployerKp.publicKey(),
            salt: hash(Buffer.from(id, 'base64')),
        },
    );

    const contractId = at.result.options.contractId;

    await at.sign({
        signTransaction: basicNodeSigner(deployerKp, PUBLIC_STELLAR_NETWORK_PASSPHRASE)
            .signTransaction,
    });

    if (at.signed) {
        await server.send(at.signed);
    }

    return json({
        contractId,
    });
};
