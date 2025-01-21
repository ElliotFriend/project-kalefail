import { json } from '@sveltejs/kit';

import { server } from '$lib/server/passkeyServer';

import type { RequestHandler } from './$types';

/**
 * Sends a Stellar smart contract transaction to Launchtube, via a PasskeyServer
 * instance.
 *
 * @remarks
 *
 * If you (as a developer) are using Launchtube to submit user transactions to
 * the network, you are opening yourself up to loss of funds if you don't guard
 * _which_ transactions you're sending, or _who_ can send those transactions.
 * You may want to ensure that the transaction is invoking a specific function
 * or transaction. Or, if you're tracking which users are registered to your
 * service, you may ensure that it's a known invoker. It's up to you, but you'd
 * likely want to put up _some_ guardrails.
 *
 * In this example template, we'll just faithfully forward _any_ transaction via
 * Launchtube. Don't do this in production!
 *
 * @param xdr - The base64-encoded, signed transaction. This transaction
 * **must** contain a Soroban operation.
 * @returns JSON object containing the RPC's response.
 */
export const POST: RequestHandler = async ({ request }) => {
    const { xdr } = await request.json();
    const res = await server.send(xdr);
    return json(res);
};
