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

    kale_salad_client.mint_salad(&fixture.owners.get(0).unwrap(), &(10 * 10_000_000), &5);
    assert_eq!(
        kale_salad_client.token_uri(&4),
        String::from_str(&env, TOKEN_4_URI,)
    );
}
