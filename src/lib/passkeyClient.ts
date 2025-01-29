import { Server } from '@stellar/stellar-sdk/rpc';
import { Asset } from '@stellar/stellar-sdk';
import { PasskeyKit, SACClient } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_WALLET_WASM_HASH,
    PUBLIC_KALE_ISSUER,
} from '$env/static/public';
import type { Tx } from '@stellar/stellar-sdk/contract';

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
 * A client allowing us to easily create SAC clients for any asset on the
 * network.
 */
export const sac = new SACClient({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});

export const kaleSacAddress = new Asset('KALE', PUBLIC_KALE_ISSUER).contractId(PUBLIC_STELLAR_NETWORK_PASSPHRASE);
export const kaleSacClient = sac.getSACClient(kaleSacAddress);

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/send` endpoint we have created.
 *
 * @param tx - The signed transaction. This transaction **must** contain a
 * Soroban operation.
 * @returns JSON object containing the RPC's response
 */
export async function send(tx: Tx) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr: tx.toXDR(),
        }),
    }).then(async (res) => {
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
