use super::*;

#[test]
fn test_approve_all() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();

    // mint some NFTs to owner
    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &5);

    // approve spender for all NFTs
    kale_salad_client.approve_all(&owner, &spender, &500);

    // check the is_approved_all responses
    let correct_approved = kale_salad_client.is_approved_all(&owner, &spender);
    assert!(correct_approved);

    // check the storage entries
    let stored_approval: Option<ApprovedData> = env.as_contract(&kale_salad_client.address, || {
        env.storage().temporary().get(&Storage::ApprovedAll(owner.clone()))
    });
    assert!(stored_approval.is_some());
    let approval_data = stored_approval.unwrap();
    assert_eq!(approval_data.spender, spender);
    assert_eq!(approval_data.expiration_ledger, 500);
}

#[test]
fn test_expired_approval() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    kale_salad_client.approve_all(&owner, &spender, &500);

    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    assert!(!kale_salad_client.is_approved_all(&owner, &spender));
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn test_cannot_approve_all_owner() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();

    kale_salad_client.approve_all(&owner, &owner, &500);
}

#[test]
#[should_panic(expected = "Error(Contract, #307)")]
fn test_cannot_approve_all_with_expired_approval() {
    let fixture = TestFixture::create();
    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    kale_salad_client.approve_all(&owner, &spender, &500);
}
