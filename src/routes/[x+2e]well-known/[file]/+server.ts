import type { RequestHandler } from './$types';
import { error, text } from '@sveltejs/kit';

const TOML_CONTENTS: string = `VERSION="2.7.0"

NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"

ACCOUNTS=[
  "GATWCHLKROX6LB2UJ6JM5VKMLLUKKQ5II6MAHFCKCEU47OYGIOENFAIL",
  "GBMDWLCULO2K6CDBK5RIRWUPOWFPOP3CQN5FFQS3Z6HVLD2FZYI4FAIL"
]

[DOCUMENTATION]
ORG_NAME="The KaleFail Project"
ORG_URL="https://kalefail.elliotfriend.com"
ORG_DESCRIPTION="A fun riff on the KALEpail project"
ORG_KEYBASE="elliotfriend"
ORG_TWITTER="elliotfriend"
ORG_GITHUB="elliotfriend"

[[PRINCIPALS]]
name="Elliot Voris"
email="elliot@stellar.org"
discord="elliotfriend"
twitter="elliotfriend"
github="elliotfriend"
keybase="elliotfriend"
telegram="ElliotVoris"

[[CURRENCIES]]
code="BROCCOLI"
issuer="GATWCHLKROX6LB2UJ6JM5VKMLLUKKQ5II6MAHFCKCEU47OYGIOENFAIL"
name="Blockchain Tree"
desc="A cultivar of the ever-popular KALE asset, powered by Soroban"
image="https://kalefail.elliotfriend.com/assets/broccoli.png"
is_asset_anchored=false

[[CURRENCIES]]
code="CABBAGE"
issuer="GATWCHLKROX6LB2UJ6JM5VKMLLUKKQ5II6MAHFCKCEU47OYGIOENFAIL"
name="Blockchain Head"
desc="A cultivar of the ever-popular KALE asset, powered by Soroban"
image="https://kalefail.elliotfriend.com/assets/cabbage.png"
is_asset_anchored=false

[[CURRENCIES]]
code="KOHLRABI"
issuer="GATWCHLKROX6LB2UJ6JM5VKMLLUKKQ5II6MAHFCKCEU47OYGIOENFAIL"
name="Blockchain Turnip"
desc="A cultivar of the ever-popular KALE asset, powered by Soroban"
image="https://kalefail.elliotfriend.com/assets/kohlrabi.png"
is_asset_anchored=false
`

export const GET: RequestHandler = async ({ params, setHeaders }) => {
    if (params.file !== 'stellar.toml') {
        error(404, { message: 'well known file not found' })
    }

    setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
    });

    return text(TOML_CONTENTS);
};
