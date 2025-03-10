use super::*;

#[test]
fn test_burn_from() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(5));
    kale_salad_client.approve(&owner, &spender, &2, &500);

    assert_eq!(kale_salad_client.balance(&owner), 5);
    kale_salad_client.burn_from(&spender, &owner, &2);
    assert_eq!(kale_salad_client.balance(&owner), 4);
}

#[test]
fn test_burn_from_approved_all() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(5));
    kale_salad_client.approve_all(&owner, &spender, &500);

    assert_eq!(kale_salad_client.balance(&owner), 5);
    kale_salad_client.burn_from(&spender, &owner, &2);
    assert_eq!(kale_salad_client.balance(&owner), 4);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_burn_from_unminted_tokens() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(5));
    kale_salad_client.approve(&owner, &spender, &2, &500);

    kale_salad_client.burn_from(&spender, &owner, &6);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_burn_from_unowned_tokens() {
    let fixture = TestFixture::create();

    let owner1 = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner1, &Some(5));
    kale_salad_client.mint_salad(&owner2, &Some(1));
    kale_salad_client.approve(&owner1, &spender, &2, &500);

    kale_salad_client.burn_from(&spender, &owner2, &5);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_burn_from_with_expired_approval() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(5));
    kale_salad_client.approve(&owner, &spender, &2, &500);

    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    kale_salad_client.burn_from(&spender, &owner, &2);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_burn_from_with_expired_approval_all() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(5));
    kale_salad_client.approve_all(&owner, &spender, &500);

    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    kale_salad_client.burn_from(&spender, &owner, &2);
}
