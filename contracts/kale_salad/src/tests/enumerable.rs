use super::*;

#[test]
fn test_enumerable_interface() {
    let fixture = TestFixture::create();
    let receiver1 = fixture.owners.get(0).unwrap();

    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&receiver1, &(10 * 10_000_000), &5);

    assert_eq!(kale_salad_client.total_supply(), 5);

    assert_eq!(kale_salad_client.token_by_index(&0), 0);
    assert_eq!(kale_salad_client.token_by_index(&1), 1);
    assert_eq!(kale_salad_client.token_by_index(&2), 2);
    assert_eq!(kale_salad_client.token_by_index(&3), 3);
    assert_eq!(kale_salad_client.token_by_index(&4), 4);

    assert_eq!(kale_salad_client.token_of_owner_by_index(&receiver1, &0), 0);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&receiver1, &1), 1);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&receiver1, &2), 2);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&receiver1, &3), 3);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&receiver1, &4), 4);
}
