use super::*;

#[test]
fn test_transfer() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &Some(4));
    // transfer 1 NFT to owner 2
    kale_salad_client.transfer(&owner1, &owner2, &2);

    // check the balances of each
    assert_eq!(kale_salad_client.balance(&owner1), 3);
    assert_eq!(kale_salad_client.balance(&owner2), 1);

    // check the owner of token2
    assert_eq!(kale_salad_client.owner_of(&2), owner2);

    // check the indexes of each owner
    assert_eq!(kale_salad_client.token_of_owner_by_index(&owner1, &0), 0);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&owner1, &1), 1);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&owner1, &2), 3);
    assert_eq!(kale_salad_client.token_of_owner_by_index(&owner2, &0), 2);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_unminted_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &Some(1));
    // transfer 1 NFT to owner 2
    kale_salad_client.transfer(&owner1, &owner2, &1);
}

#[test]
#[should_panic(expected = "Error(Contract, #301)")]
fn test_cannot_transfer_unowned_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let receiver = fixture.owners.get(0).unwrap();
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint an NFT to owner1
    kale_salad_client.mint_salad(&owner1, &TEN_TOKENS, &Some(1));
    kale_salad_client.mint_salad(&owner2, &TEN_TOKENS, &Some(1));
    // transfer 1 NFT to owner 2
    kale_salad_client.transfer(&owner1, &receiver, &1);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_burned_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let receiver = fixture.owners.get(0).unwrap();
    let owner = fixture.owners.get(1).unwrap();

    // mint an NFT to owner1
    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &Some(1));
    // burn the NFT
    kale_salad_client.burn(&owner, &0);
    // attempt the transfer
    kale_salad_client.transfer(&owner, &receiver, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_burned_from_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let receiver = fixture.owners.get(0).unwrap();
    let owner = fixture.owners.get(1).unwrap();
    let spender = fixture.owners.get(2).unwrap();

    // mint an NFT to owner1
    kale_salad_client.mint_salad(&owner, &TEN_TOKENS, &Some(1));
    // approve spender
    kale_salad_client.approve(&owner, &spender, &0, &1000);
    // burn the NFT
    kale_salad_client.burn_from(&spender, &owner, &0);
    // attempt the transfer
    kale_salad_client.transfer(&owner, &receiver, &0);
}
