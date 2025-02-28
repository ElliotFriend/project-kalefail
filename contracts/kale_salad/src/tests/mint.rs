use super::*;
extern crate std;

#[test]
fn test_can_mint() {
    let fixture = TestFixture::create();

    let receiver = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;
    let [(broc, broc_sep), (cabb, cabb_sep), (kohl, kohl_sep), (brsp, brsp_sep)] =
        fixture.vegetables;


    // should have 1000 already from the fixture
    assert_eq!(broc_sep.balance(&receiver), 1000 * 10_000_000);
    assert_eq!(cabb_sep.balance(&receiver), 1000 * 10_000_000);
    assert_eq!(kohl_sep.balance(&receiver), 1000 * 10_000_000);
    assert_eq!(brsp_sep.balance(&receiver), 1000 * 10_000_000);

    kale_salad_client.mint_salad(&receiver, &(10 * 10_000_000), &1);

    assert_eq!(broc_sep.balance(&receiver), 990 * 10_000_000);
    assert_eq!(cabb_sep.balance(&receiver), 990 * 10_000_000);
    assert_eq!(kohl_sep.balance(&receiver), 990 * 10_000_000);
    assert_eq!(brsp_sep.balance(&receiver), 990 * 10_000_000);

    assert_eq!(kale_salad_client.balance(&receiver), 1);

    kale_salad_client.mint_salad(&receiver, &(10 * 10_000_000), &1);

    assert_eq!(broc_sep.balance(&receiver), 980 * 10_000_000);
    assert_eq!(cabb_sep.balance(&receiver), 980 * 10_000_000);
    assert_eq!(kohl_sep.balance(&receiver), 980 * 10_000_000);
    assert_eq!(brsp_sep.balance(&receiver), 980 * 10_000_000);

    assert_eq!(kale_salad_client.balance(&receiver), 2);
}
