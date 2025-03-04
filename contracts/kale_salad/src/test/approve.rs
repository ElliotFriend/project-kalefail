use super::*;

#[test]
fn test_approve() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &5);

    // approve spender for token 0
    kale_salad_client.approve(&owner1, &spender, &0, &500);

    // check the get_approved responses
    let correct_approved = kale_salad_client.get_approved(&0);
    assert!(correct_approved.is_some());
    assert_eq!(correct_approved.unwrap(), spender);

    let wrong_approved = kale_salad_client.get_approved(&1);
    assert!(wrong_approved.is_none());

    // check the storage entries
    let stored_approval: Option<ApprovedData> = env.as_contract(&kale_salad_client.address, || {
        env.storage().temporary().get(&Storage::Approved(0))
    });
    assert!(stored_approval.is_some());
    let approval_data = stored_approval.unwrap();
    assert_eq!(approval_data.spender, spender);
    assert_eq!(approval_data.expiration_ledger, 500);

    // check that there is no storage entry for other NFTs
    let unstored_approval: Option<ApprovedData> = env
        .as_contract(&kale_salad_client.address, || {
            env.storage().temporary().get(&Storage::Approved(1))
        });
    assert!(unstored_approval.is_none());
}

#[test]
fn test_approve_to_remove() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &5);

    kale_salad_client.approve(&owner, &spender, &0, &500);
    kale_salad_client.approve(&owner, &spender, &0, &0);

    // check that there is no storage entry for anymore
    let unstored_approval: Option<ApprovedData> = env
        .as_contract(&kale_salad_client.address, || {
            env.storage().temporary().get(&Storage::Approved(0))
        });
    assert!(unstored_approval.is_none());
}

#[test]
fn test_expired_approval() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &5);

    kale_salad_client.approve(&owner, &spender, &0, &500);

    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    assert!(kale_salad_client.get_approved(&0).is_none());
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn test_cannot_approve_owner() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();

    kale_salad_client.approve(&owner, &owner, &0, &500);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_approve_unminted_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    kale_salad_client.approve(&owner, &spender, &192, &500);
}

#[test]
#[should_panic(expected = "Error(Contract, #306)")]
fn test_cannot_approve_unowned_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(3).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &5);

    kale_salad_client.approve(&owner2, &spender, &0, &500);
}

#[test]
#[should_panic(expected = "Error(Contract, #307)")]
fn test_cannot_approve_with_expired_approval() {
    let fixture = TestFixture::create();
    fixture.env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..fixture.env.ledger().get()
    });

    let kale_salad_client = fixture.kale_salad_client;
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &5);

    kale_salad_client.approve(&owner, &spender, &0, &500);
}
