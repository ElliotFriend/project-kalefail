use super::*;

#[test]
fn test_burn() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &Some(1));
    kale_salad_client.burn(&owner, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_burn_unminted_token() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &Some(1));
    kale_salad_client.burn(&owner, &1);
}

#[test]
#[should_panic(expected = "Error(Contract, #301)")]
fn test_cannot_burn_unowned_token() {
    let fixture = TestFixture::create();

    let owner1 = fixture.owners.get(0).unwrap();
    let owner2 = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &Some(1));
    kale_salad_client.burn(&owner2, &0);
}
