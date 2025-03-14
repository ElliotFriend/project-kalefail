use super::*;

use soroban_sdk::testutils::Address as _;
use test_fixture::{create_owners_vec, mint_vegetables_to_owners};

#[test]
fn test_can_mint() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;
    let [(_, broc), (_, cabb), (_, kohl), (_, brsp)] = fixture.vegetables;

    // should have 1000 already from the fixture
    assert_eq!(broc.balance(&owner), 1000 * 10_000_000);
    assert_eq!(cabb.balance(&owner), 1000 * 10_000_000);
    assert_eq!(kohl.balance(&owner), 1000 * 10_000_000);
    assert_eq!(brsp.balance(&owner), 1000 * 10_000_000);

    kale_salad_client.mint_salad(&owner, &Some(1));

    assert_eq!(broc.balance(&owner), 990 * 10_000_000);
    assert_eq!(cabb.balance(&owner), 990 * 10_000_000);
    assert_eq!(kohl.balance(&owner), 990 * 10_000_000);
    assert_eq!(brsp.balance(&owner), 990 * 10_000_000);

    assert_eq!(kale_salad_client.balance(&owner), 1);

    kale_salad_client.mint_salad(&owner, &Some(1));

    assert_eq!(broc.balance(&owner), 980 * 10_000_000);
    assert_eq!(cabb.balance(&owner), 980 * 10_000_000);
    assert_eq!(kohl.balance(&owner), 980 * 10_000_000);
    assert_eq!(brsp.balance(&owner), 980 * 10_000_000);

    assert_eq!(kale_salad_client.balance(&owner), 2);
    fixture.env.as_contract(&kale_salad_client.address, || {
        assert_eq!(
            fixture
                .env
                .storage()
                .instance()
                .get::<_, u32>(&Storage::Supply)
                .unwrap(),
            2
        );
    });
    // assert_eq!(kale_salad_client.total_supply(), 2);
}

#[test]
fn test_can_mint_again() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(1));
    kale_salad_client.mint_salad(&owner, &Some(1));
    kale_salad_client.mint_salad(&owner, &Some(3));
}

#[test]
#[should_panic(expected = "Error(Contract, #202)")]
fn test_cannot_exceed_maximum_tokens_per_address_one_invocation() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(6));
}

#[test]
#[should_panic(expected = "Error(Contract, #202)")]
fn test_cannot_exceed_maximum_tokens_per_address_multi_invocation() {
    let fixture = TestFixture::create();

    let owner = fixture.owners.get(0).unwrap();
    let kale_salad_client = fixture.kale_salad_client;

    kale_salad_client.mint_salad(&owner, &Some(3));
    kale_salad_client.mint_salad(&owner, &Some(3));
}

#[test]
#[should_panic(expected = "Error(Contract, #201)")]
fn test_cannot_exceed_maximum_tokens_to_be_minted() {
    let fixture = TestFixture::create();
    let env = fixture.env;
    let kale_salad_client = fixture.kale_salad_client;
    let owners = create_owners_vec(&env, &50);
    let [(broc, _), (cabb, _), (kohl, _), (brsp, _)] = fixture.vegetables;
    let vegetables = [&broc, &cabb, &kohl, &brsp];
    mint_vegetables_to_owners(&owners, vegetables);

    // the first fifty people can get their NFTs
    owners.iter().for_each(|owner| {
        kale_salad_client.mint_salad(&owner, &Some(5));
    });
    owners.iter().for_each(|owner| {
        assert_eq!(kale_salad_client.balance(&owner), 5);
    });

    let late_owner = Address::generate(&env);
    mint_vegetables_to_owners(&vec![&env, late_owner.clone()], vegetables);
    // this should fail, even though we're willing to pay twice the price!
    kale_salad_client.mint_salad(&late_owner, &Some(1));
}
