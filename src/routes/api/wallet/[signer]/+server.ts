import { server } from '$lib/server/passkeyServer';
import type { RequestHandler } from './$types';

/**
 * Perform a reverse-lookup for a smart wallet contract address, given a known
 * passkey ID, via a PasskeyServer instance.
 *
 * @param signer - The public key from the Passkey which should be searched for
 * @returns The contract address to which the specified signer has been added
 */
export const GET: RequestHandler = async ({ params }) => {
    const contractAddress = await server.getContractId({ keyId: params.signer });
    return new Response(contractAddress);
};
