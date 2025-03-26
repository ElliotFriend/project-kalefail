use super::*;

#[test]
fn test_transfer() {
    let fixture = TestFixture::create();
    let env = fixture.env;

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(5));

    // check some storage entries
    env.as_contract(&kale_salad_client.address, || {
        assert_eq!(env.storage().persistent().get::<_, Vec<u32>>(&Storage::Balance(owner1.clone())).unwrap(), vec![&env, 0u32, 1u32, 2u32, 3u32, 4u32]);
        assert!(env.storage().persistent().get::<_, Vec<u32>>(&Storage::Balance(owner2.clone())).is_none());

        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(0u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(1u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(2u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(3u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(4u32)).unwrap(), owner1.clone());
    });

    // transfer 1 NFT to owner 2
    kale_salad_client.transfer(&owner1, &owner2, &2);

    // check the balances of each
    assert_eq!(kale_salad_client.balance(&owner1), 4);
    assert_eq!(kale_salad_client.balance(&owner2), 1);

    // check the owner of token2
    assert_eq!(kale_salad_client.owner_of(&2), owner2);

    // check the changed storage entries
    env.as_contract(&kale_salad_client.address, || {
        assert_eq!(env.storage().persistent().get::<_, Vec<u32>>(&Storage::Balance(owner1.clone())).unwrap(), vec![&env, 0u32, 1u32, 3u32, 4u32]);
        assert_eq!(env.storage().persistent().get::<_, Vec<u32>>(&Storage::Balance(owner2.clone())).unwrap(), vec![&env, 2u32]);

        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(0u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(1u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(2u32)).unwrap(), owner2.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(3u32)).unwrap(), owner1.clone());
        assert_eq!(env.storage().persistent().get::<_, Address>(&Storage::Owner(4u32)).unwrap(), owner1.clone());
    });
}

#[test]
#[should_panic(expected = "Error(Contract, #300)")]
fn test_cannot_transfer_unminted_token() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let owner1 = fixture.owners.get(1).unwrap();
    let owner2 = fixture.owners.get(2).unwrap();

    // mint some NFTs to owner1
    kale_salad_client.mint_salad(&owner1, &Some(1));
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
    kale_salad_client.mint_salad(&owner1, &Some(1));
    kale_salad_client.mint_salad(&owner2, &Some(1));
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
    kale_salad_client.mint_salad(&owner, &Some(1));
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
    kale_salad_client.mint_salad(&owner, &Some(1));
    // approve spender
    kale_salad_client.approve(&owner, &spender, &0, &1000);
    // burn the NFT
    kale_salad_client.burn_from(&spender, &owner, &0);
    // attempt the transfer
    kale_salad_client.transfer(&owner, &receiver, &0);
}

#[test]
#[should_panic(expected = "Error(Contract, #202)")]
fn test_cannot_transfer_if_to_already_has_max() {
    let fixture = TestFixture::create();

    let kale_salad_client = fixture.kale_salad_client;
    let receiver = fixture.owners.get(0).unwrap();
    let owner = fixture.owners.get(1).unwrap();

    // mint an NFT to owner
    kale_salad_client.mint_salad(&owner, &None::<u32>);
    // mint 5 NFTs to receiver
    kale_salad_client.mint_salad(&receiver, &Some(5));

    kale_salad_client.transfer(&owner, &receiver, &0);
}
