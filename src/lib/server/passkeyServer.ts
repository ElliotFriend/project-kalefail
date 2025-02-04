import { PasskeyServer } from 'passkey-kit';
import { Keypair } from '@stellar/stellar-sdk';

import {
    PUBLIC_LAUNCHTUBE_URL,
    PUBLIC_MERCURY_URL,
    PUBLIC_STELLAR_RPC_URL,
} from '$env/static/public';
import { PRIVATE_LAUNCHTUBE_JWT, PRIVATE_MERCURY_TOKEN, PRIVATE_FAIL_WALLET_DEPLOYER_SECRET } from '$env/static/private';

export const server = new PasskeyServer({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    launchtubeUrl: PUBLIC_LAUNCHTUBE_URL,
    launchtubeJwt: PRIVATE_LAUNCHTUBE_JWT,
    mercuryProjectName: 'smart-wallets-next-dima',
    mercuryUrl: PUBLIC_MERCURY_URL,
    mercuryKey: PRIVATE_MERCURY_TOKEN,
});

// export const walletDeployerPublicKey = Keypair.fromSecret(PRIVATE_FAIL_WALLET_DEPLOYER_SECRET).publicKey()
