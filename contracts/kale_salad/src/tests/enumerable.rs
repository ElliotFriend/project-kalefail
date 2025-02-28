use super::*;

#[test]
fn test_enumerable_interface() {
    let fixture = TestFixture::create();
    let receiver = fixture.owners.get(0).unwrap();

    let kale_salad_client = fixture.kale_salad_client;
    let [(broc, _), (cabb, _), (kohl, _), (brsp, _)] = fixture.vegetables;

    // broc.mint(&receiver, &(100 * 10_000_000));
    // cabb.mint(&receiver, &(100 * 10_000_000));
    // kohl.mint(&receiver, &(100 * 10_000_000));
    // brsp.mint(&receiver, &(100 * 10_000_000));

    kale_salad_client.mint_salad(&receiver, &(10 * 10_000_000), &5);

    assert_eq!(kale_salad_client.total_supply(), 5);
}
