import * as Client from 'hello_world';
import { PUBLIC_STELLAR_RPC_URL } from '$env/static/public';

export default new Client.Client({
    ...Client.networks.testnet,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});
