#![cfg(test)]

use super::*;
use soroban_sdk::{bytes, testutils::Address as _, token, vec, Env};

#[test]
fn test_constructor_with_no_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let kale = env.register_stellar_asset_contract_v2(admin.clone());

    env.register(
        TradingPostContract,
        (&admin, &kale.address(), None::<Vec<Address>>, None::<u32>),
    );
}

#[test]
fn test_constructor_with_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
}

#[test]
fn test_close_and_reopen() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());
    broccoli_sac_client.set_admin(&trading_post_address);

    trading_post_client.open();
    trading_post_client.close();
}

#[test]
fn test_trade_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let kale_client = token::Client::new(&env, &kale.address());
    let kale_sac_client = token::StellarAssetClient::new(&env, &kale.address());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());
    let broccoli_client = token::Client::new(&env, &broccoli.address());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    broccoli_sac_client.set_admin(&trading_post_address);
    trading_post_client.open();

    // mint kale tokens to the farmer
    kale_sac_client.mint(&farmer, &100i128);
    assert_eq!(100i128, kale_client.balance(&farmer));

    // exchange 25 stroops of kale for broccoli
    trading_post_client.trade(&farmer, &broccoli.address(), &25i128);
    assert_eq!(75i128, kale_client.balance(&farmer));
    assert_eq!(25i128, kale_client.balance(&trading_post_address));
    assert_eq!(25i128, broccoli_client.balance(&farmer));
}

#[test]
fn test_trade_for_kale_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let kale_client = token::Client::new(&env, &kale.address());
    let kale_sac_client = token::StellarAssetClient::new(&env, &kale.address());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());
    let broccoli_client = token::Client::new(&env, &broccoli.address());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    broccoli_sac_client.set_admin(&trading_post_address);
    trading_post_client.open();

    // mint kale tokens to the trading post contract
    kale_sac_client.mint(&trading_post_address, &100i128);
    assert_eq!(100i128, kale_client.balance(&trading_post_address));

    // mint some broccoli to the farmer
    broccoli_sac_client.mint(&farmer, &25i128);
    assert_eq!(25i128, broccoli_client.balance(&farmer));

    // exchange 25 stroops of broccoli for kale
    trading_post_client.trade_for_kale(&farmer, &broccoli.address(), &25i128);
    assert_eq!(25i128, kale_client.balance(&farmer));
    assert_eq!(75i128, kale_client.balance(&trading_post_address));
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn test_cannot_trade_untradable_vegetable() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let kale_sac_client = token::StellarAssetClient::new(&env, &kale.address());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    broccoli_sac_client.set_admin(&trading_post_address);
    trading_post_client.open();

    // mint kale tokens to the farmer
    kale_sac_client.mint(&farmer, &100i128);

    // create a dummy token that we can _try_ to swap for
    let pumpkin = env.register_stellar_asset_contract_v2(admin.clone());
    trading_post_client.trade(&farmer, &pumpkin.address(), &25i128);
}

#[test]
#[should_panic(expected = "Error(Contract, #2")]
fn test_trade_trading_post_closed() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let kale_client = token::Client::new(&env, &kale.address());
    let kale_sac_client = token::StellarAssetClient::new(&env, &kale.address());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    broccoli_sac_client.set_admin(&trading_post_address);

    // mint kale tokens to the farmer
    kale_sac_client.mint(&farmer, &100i128);
    assert_eq!(100i128, kale_client.balance(&farmer));

    // exchange 25 stroops of kale for broccoli
    trading_post_client.trade(&farmer, &broccoli.address(), &25i128);
}

#[test]
#[should_panic(expected = "Error(Contract, #3")]
fn test_cannot_open_with_no_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let kale = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (&admin, &kale.address(), None::<Vec<Address>>, None::<u32>),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);
    trading_post_client.open();
}

#[test]
#[should_panic(expected = "Error(Contract, #4")]
fn test_cannot_open_without_sac_admin_permissions() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.open();
}

#[test]
#[should_panic(expected = "Error(Contract, #5")]
fn test_cannot_remove_vegetables_when_none_are_available() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (&admin, &kale.address(), None::<Vec<Address>>, None::<u32>),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.remove_vegetables(&vec![&env, broccoli.address()]);
}

#[test]
#[should_panic(expected = "Error(Contract, #6")]
fn test_cannot_add_vegetable_if_already_available() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.add_vegetables(&vec![&env, broccoli.address()]);
}

#[test]
#[should_panic(expected = "Error(Contract, #7")]
fn test_cannot_upgrade_when_open() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());
    broccoli_sac_client.set_admin(&trading_post_address);

    trading_post_client.open();

    trading_post_client.upgrade(&env.crypto().sha256(&bytes!(&env, 0xdeadb33f)).to_bytes());
}

#[test]
#[should_panic(expected = "Error(Contract, #8)")]
fn test_constructor_with_too_many_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let brussels_sprouts = env.register_stellar_asset_contract_v2(admin.clone());

    env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address(), brussels_sprouts.address()],
            1u32,
        ),
    );
}

#[test]
#[should_panic(expected = "Error(Contract, #8)")]
fn test_cannot_add_too_many_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let brussels_sprouts = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            1u32,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.add_vegetables(&vec![&env, brussels_sprouts.address()]);
}

#[test]
fn test_can_add_up_to_max_vegetables() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let brussels_sprouts = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            2u32,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.add_vegetables(&vec![&env, brussels_sprouts.address()]);
}

#[test]
#[should_panic(expected = "Error(Contract, #9)")]
fn test_cannot_grow_shelf_space_smaller() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.grow_shelf_space(&3u32);
}

#[test]
#[should_panic(expected = "Error(Contract, #10)")]
fn test_cannot_shrink_shelf_space_bigger() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    trading_post_client.shrink_shelf_space(&5u32);
}

#[test]
#[should_panic(expected = "Error(Contract, #11)")]
fn test_cannot_trade_for_kale_with_insufficient_balance() {
    let env = Env::default();
    env.mock_all_auths();

    // set up some users
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    // set up some assets
    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let kale_client = token::Client::new(&env, &kale.address());
    let kale_sac_client = token::StellarAssetClient::new(&env, &kale.address());
    let broccoli = env.register_stellar_asset_contract_v2(admin.clone());
    let broccoli_sac_client = token::StellarAssetClient::new(&env, &broccoli.address());
    let broccoli_client = token::Client::new(&env, &broccoli.address());

    let trading_post_address = env.register(
        TradingPostContract,
        (
            &admin,
            &kale.address(),
            vec![&env, broccoli.address()],
            None::<u32>,
        ),
    );
    let trading_post_client = TradingPostContractClient::new(&env, &trading_post_address);

    broccoli_sac_client.set_admin(&trading_post_address);
    trading_post_client.open();

    // mint kale tokens to the trading post contract
    kale_sac_client.mint(&trading_post_address, &10i128);
    assert_eq!(10i128, kale_client.balance(&trading_post_address));

    // mint some broccoli to the farmer
    broccoli_sac_client.mint(&farmer, &25i128);
    assert_eq!(25i128, broccoli_client.balance(&farmer));

    // exchange 25 stroops of broccoli for kale
    trading_post_client.trade_for_kale(&farmer, &broccoli.address(), &25i128);
    assert_eq!(25i128, kale_client.balance(&farmer));
}
