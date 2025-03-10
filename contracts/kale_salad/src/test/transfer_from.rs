use super::*;

#[test]
fn test_transfer_from_approved() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // approve spender for token 0
    kale_salad_client.approve(&owner1, &spender, &0, &500);

    // have spender transfer it to owner2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &0);

    // make sure the get_approved function no longer returns anything
    let approved = kale_salad_client.get_approved(&0);
    assert!(approved.is_none());

    // check that the storage entry is gone
    let unstored_approval: Option<ApprovedData> = env
        .as_contract(&kale_salad_client.address, || {
            env.storage().temporary().get(&Storage::Approved(0))
        });
    assert!(unstored_approval.is_none());
}

#[test]
fn test_transfer_from_approved_all() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // approve spender for owner1
    kale_salad_client.approve_all(&owner1, &spender, &500);

    // have spender transfer it to owner2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &0);

    // make sure the get_approved_all function still returns true
    let approve = kale_salad_client.is_approved_all(&owner1, &spender);
    assert!(approve);

    // check that the storage entry is still there
    let stored_approval: Option<ApprovedData> = env.as_contract(&kale_salad_client.address, || {
        env.storage().temporary().get(&Storage::ApprovedAll(owner1))
    });
    assert!(stored_approval.is_some());
    let approval_data = stored_approval.unwrap();
    assert_eq!(approval_data.spender, spender);
    assert_eq!(approval_data.expiration_ledger, 500);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_if_not_approved() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // have spender transfer it to owner2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_if_not_approved_for_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // approve spender for token 0
    kale_salad_client.approve(&owner1, &spender, &0, &500);

    // have spender transfer token 2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &2);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_with_expired_approval() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // approve spender for token 0
    kale_salad_client.approve(&owner1, &spender, &0, &500);

    // bump the ledger into the future
    env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..env.ledger().get()
    });

    // have spender transfer it to owner2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_with_expired_approval_all() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(3).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // approve spender for token 0
    kale_salad_client.approve_all(&owner1, &spender, &500);

    // bump the ledger into the future
    env.ledger().set(LedgerInfo {
        sequence_number: 1000,
        ..env.ledger().get()
    });

    // have spender transfer it to owner2
    kale_salad_client.transfer_from(&spender, &owner1, &owner2, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_already_transferred_token() {
    let fixture = TestFixture::create();
    let kale_salad_client = fixture.kale_salad_client;

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let to = fixture.owners.get(2).unwrap();
    let another_to = fixture.owners.get(3).unwrap();

    // mint NFTs
    kale_salad_client.mint_salad(&owner, &Some(5));
    // approve spender for token 2
    kale_salad_client.approve(&owner, &spender, &2, &1000);
    assert!(kale_salad_client.get_approved(&2).is_some());
    assert_eq!(kale_salad_client.get_approved(&2).unwrap(), spender);
    // transfer token 2 without spender
    kale_salad_client.transfer(&owner, &to, &2);
    // make sure the approval has cleared, while we're here
    assert!(kale_salad_client.get_approved(&2).is_none());

    // attempt the transfer from
    kale_salad_client.transfer_from(&spender, &to, &another_to, &2);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_cannot_transfer_from_already_transferred_from_token() {
    let fixture = TestFixture::create();
    let kale_salad_client = fixture.kale_salad_client;

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let to = fixture.owners.get(2).unwrap();
    let another_to = fixture.owners.get(3).unwrap();

    // mint NFTs
    kale_salad_client.mint_salad(&owner, &Some(5));
    // approve spender for token 2
    kale_salad_client.approve(&owner, &spender, &2, &1000);
    // transfer token 2 without spender
    kale_salad_client.transfer_from(&spender, &owner, &to, &2);

    // attempt the transfer from
    kale_salad_client.transfer_from(&spender, &to, &another_to, &2);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_from_burned_token() {
    let fixture = TestFixture::create();
    let kale_salad_client = fixture.kale_salad_client;

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let to = fixture.owners.get(2).unwrap();

    // mint NFTs
    kale_salad_client.mint_salad(&owner, &Some(5));
    // approve spender for token 2
    kale_salad_client.approve(&owner, &spender, &2, &1000);
    // burn token 2 without spender
    kale_salad_client.burn(&owner, &2);

    // attempt the transfer from
    kale_salad_client.transfer_from(&spender, &owner, &to, &2);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_from_burned_from_token() {
    let fixture = TestFixture::create();
    let kale_salad_client = fixture.kale_salad_client;

    let owner = fixture.owners.get(0).unwrap();
    let spender = fixture.owners.get(1).unwrap();
    let to = fixture.owners.get(2).unwrap();

    // mint NFTs
    kale_salad_client.mint_salad(&owner, &Some(5));
    // approve spender for token 2
    kale_salad_client.approve(&owner, &spender, &2, &1000);
    // burn from token 2
    kale_salad_client.burn_from(&spender, &owner, &2);

    // attempt the transfer from
    kale_salad_client.transfer_from(&spender, &owner, &to, &2);
}


#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_cannot_transfer_from_if_to_already_has_max() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let receiver = fixture.owners.get(0).unwrap();
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    // mint an NFT to owner
    kale_salad_client.mint_salad(&owner, &None::<u32>);
    // mint 5 NFTs to receiver
    kale_salad_client.mint_salad(&receiver, &Some(5));

    kale_salad_client.approve(&owner, &spender, &0, &500);
    kale_salad_client.transfer_from(&spender, &owner, &receiver, &0);
}
