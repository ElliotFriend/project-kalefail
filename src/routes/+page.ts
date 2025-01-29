import type { PageLoad } from './$types';
import { PUBLIC_KALE_ISSUER, PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import { Address, Asset, xdr, nativeToScVal } from '@stellar/stellar-sdk';
import hello_world from '$lib/contracts/hello_world';
import { sac } from '$lib/passkeyClient';

export const load: PageLoad = async () => {
    // THIS ALL WORKS!
    // const kaleAsset = new Asset('KALE', PUBLIC_KALE_ISSUER)
    // const kaleSAC = kaleAsset.contractId(PUBLIC_STELLAR_NETWORK_PASSPHRASE)
    // const kaleClient = sac.getSACClient(kaleSAC);
    // const { result: kaleHomestead } = await kaleClient.admin();
    // console.log(kaleHomestead)

    const { result } = await hello_world.hello({
        to: 'SvelteKit Passkeys',
    });

    return {
        greeting: result,
    };
};
