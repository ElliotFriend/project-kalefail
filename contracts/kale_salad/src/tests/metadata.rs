// use crate::tests::test_fixture::TestFixture;

use super::*;

#[test]
fn test_metadata_interface() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;

    assert_eq!(kale_salad_client.decimals(), 0);
    assert_eq!(kale_salad_client.name(), String::from_str(&env, NFT_NAME));
    assert_eq!(
        kale_salad_client.symbol(),
        String::from_str(&env, NFT_SYMBOL)
    );
    assert_eq!(
        kale_salad_client.base_uri(),
        String::from_str(&env, IPFS_URI)
    );

    // TODO: since this panics with un-minted NFTs, it throws in this test...
    // assert_eq!(
    //     kale_salad_client.token_uri(&192),
    //     String::from_str(&env, TOKEN_192_URI,)
    // );
}
