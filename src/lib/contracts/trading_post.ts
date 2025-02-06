import * as Client from 'trading_post';
import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';

export default new Client.Client({
    ...Client.networks.public,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});
