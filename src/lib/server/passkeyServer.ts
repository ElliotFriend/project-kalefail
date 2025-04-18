import { PasskeyServer } from 'passkey-kit';

import {
    PUBLIC_LAUNCHTUBE_URL,
    PUBLIC_MERCURY_URL,
    PUBLIC_STELLAR_RPC_URL,
} from '$env/static/public';
import { PRIVATE_LAUNCHTUBE_JWT, PRIVATE_MERCURY_TOKEN } from '$env/static/private';
import { version } from '../../../package.json'

export const server = new PasskeyServer({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    launchtubeUrl: PUBLIC_LAUNCHTUBE_URL,
    launchtubeJwt: PRIVATE_LAUNCHTUBE_JWT,
    launchtubeHeaders: {
        'X-Client-Name': 'kalefail-website',
        'X-Client-Version': version,
    },
    mercuryProjectName: 'smart-wallets-kalefail',
    mercuryUrl: PUBLIC_MERCURY_URL,
    mercuryKey: PRIVATE_MERCURY_TOKEN,
    // mercuryJwt: PRIVATE_MERCURY_JWT,
});
