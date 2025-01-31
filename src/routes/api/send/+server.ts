import { json, error } from '@sveltejs/kit';
import { server } from '$lib/server/passkeyServer';
import type { RequestHandler } from './$types';

/**
 * Sends a Stellar smart contract transaction to Launchtube, via a PasskeyServer
 * instance.
 *
 * @param xdr - The base64-encoded, signed transaction. This transaction
 * **must** contain a Soroban operation.
 * @returns JSON object containing the RPC's response.
 */
export const POST: RequestHandler = async ({ url, request }) => {
    if (request.headers.get('referer')?.includes(url.origin)) {
        const { xdr } = await request.json();
        const res = await server.send(xdr);
        return json(res);
    } else {
        error(403, { message: 'hostname mismatch'})
    }
};
