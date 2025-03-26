import * as Client from 'kale_salad';
import { PUBLIC_STELLAR_RPC_URL, PUBLIC_STELLAR_NETWORK } from '$env/static/public';

export default new Client.Client({
    //@ts-ignore
    ...Client.networks[PUBLIC_STELLAR_NETWORK],
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});
