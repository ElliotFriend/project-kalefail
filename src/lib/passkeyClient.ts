import { Server } from '@stellar/stellar-sdk/rpc';
import { Asset, hash, TransactionBuilder, Transaction, type Operation } from '@stellar/stellar-sdk';
import { PasskeyClient, PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_WALLET_WASM_HASH,
    PUBLIC_KALE_ISSUER,
    PUBLIC_FAIL_WALLET_DEPLOYER_ADDRESS,
} from '$env/static/public';
import { AssembledTransaction, basicNodeSigner, type Tx } from '@stellar/stellar-sdk/contract';

/**
 * A configured Stellar RPC server instance used to interact with the network
 */
export const rpc = new Server(PUBLIC_STELLAR_RPC_URL);

/**
 * The account object is an instance of the PasskeyKit class. This is the
 * primary means of communicating with our user's smart wallet from the client.
 */
export const account = new PasskeyKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    walletWasmHash: PUBLIC_WALLET_WASM_HASH,
});

/**
 * The passkey-kit implementation of the `createWallet` function isn't currently
 * suitable for Mainnet, since it uses the Genesis account to sign the inner
 * transaction. This sidesteps that for the time-being.
 */
// export async function createWallet(app: string, user: string) {
//     const { keyId, keyIdBase64, publicKey } = await account.createKey(
//         app,
//         user,
//     )

//     let at = await PasskeyClient.deploy({
//         signer: {
//             tag: 'Secp256r1',
//             values: [
//                 keyId,
//                 publicKey,
//                 [undefined],
//                 [undefined],
//                 { tag: 'Persistent', values: undefined },
//             ],
//         },
//     },
//     {
//         rpcUrl: PUBLIC_STELLAR_RPC_URL,
//         wasmHash: PUBLIC_WALLET_WASM_HASH,
//         networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
//         publicKey: PUBLIC_FAIL_WALLET_DEPLOYER_ADDRESS,
//         salt: hash(keyId),
//     })

//     const contractId = at.result.options.contractId

//     account.wallet = new PasskeyClient({
//         contractId,
//         networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
//         rpcUrl: PUBLIC_STELLAR_RPC_URL,
//     })

//     let { signedTxXdr }  = await deploy(at.toXDR())

//     return {
//         keyId,
//         keyIdBase64,
//         contractId,
//         signedTxXdr,
//     }
// }

/**
 * A client allowing us to easily create SAC clients for any asset on the
 * network.
 */
export const sac = new SACClient({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});

export const kaleSacAddress = new Asset('KALE', PUBLIC_KALE_ISSUER).contractId(
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
);
export const kaleSacClient = sac.getSACClient(kaleSacAddress);

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/send` endpoint we have created.
 *
 * @param tx - The signed transaction. This transaction **must** contain a
 * Soroban operation.
 * @returns JSON object containing the RPC's response
 */
export async function send(tx: Tx | string) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr: typeof tx === 'string' ? tx : tx.toXDR(),
        }),
    }).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/wallet/deploy` endpoint we have created. This will sign a transaction
 * that can deploy the smart wallet to the network.
 *
 * @param xdr The base64-encoded transaction that should be signed by the
 * deployer keypair.
 * @returns An object containing a signed, base64-encoded transaction which is
 * ready to submit to the network
 */
export async function deploy(id: string, pk: string) {
    return fetch(`/api/deploy?id=${id}&pk=${pk}`).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/wallet/[signer]` endpoint we have created.
 *
 * @param signer - The passkey ID we want to find an associated smart wallet for
 * @returns The contract address to which the specified signer has been added
 */
export async function getWalletAddress(signer: string) {
    return fetch(`/api/wallet/${signer}`).then(async (res) => {
        if (res.ok) return res.text();
        else throw await res.text();
    });
}
