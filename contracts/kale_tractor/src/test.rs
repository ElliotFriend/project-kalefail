#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

mod homestead_contract {
    use soroban_sdk::auth::Context;
    soroban_sdk::contractimport!(file = "kale_homestead.wasm");
}

#[test]
fn test_constructor() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);

    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let homestead_address = env.register(homestead_contract::WASM, (admin, kale.address()));

    env.register(KaleTractorContract, (homestead_address,));
}

#[test]
#[should_panic(expected = "Error(Contract, #1)")]
fn test_with_no_pails_provided() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let homestead_address = env.register(homestead_contract::WASM, (admin, kale.address()));

    let tractor_address = env.register(KaleTractorContract, (homestead_address,));
    let tractor_client = KaleTractorContractClient::new(&env, &tractor_address);
    tractor_client.harvest(&farmer, &vec![&env]);
}

#[test]
fn test_with_all_harvestable_pails() {
    let env = Env::from_ledger_snapshot_file("snapshot.json");

    let homestead_address = Address::from_str(
        &env,
        &"CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
    );

    let tractor_address = env.register(KaleTractorContract, (homestead_address,));
    let tractor_client = KaleTractorContractClient::new(&env, &tractor_address);

    // these pails, for this user, just so happen to be present and harvestable given the snapshot file.
    let farmer = Address::from_str(
        &env,
        &"GBQZZ54DGBXZ6USGU5PMMAJVDLALGEMXXZEZC5BDDSAG7FI653DLMVTN",
    );
    let rewards = tractor_client.harvest(
        &farmer,
        &vec![&env, 11692, 11697, 11698, 11699, 11700, 11701],
    );

    assert!(!rewards.is_empty());
    assert!(rewards.iter().all(|r| r > 0));
    assert_eq!(rewards.iter().sum::<i128>(), 21566344);
    assert_eq!(rewards.len(), 6);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")]
fn test_with_all_unharvestable_pails() {
    let env = Env::default();
    env.mock_all_auths_allowing_non_root_auth();

    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);

    let kale = env.register_stellar_asset_contract_v2(admin.clone());
    let homestead_address = env.register(homestead_contract::WASM, (admin, kale.address()));

    let tractor_address = env.register(KaleTractorContract, (homestead_address,));
    let tractor_client = KaleTractorContractClient::new(&env, &tractor_address);
    tractor_client.harvest(&farmer, &vec![&env, 0, 1, 2, 3]);
}

#[test]
fn test_with_mixed_harvestable_pails() {
    let env = Env::from_ledger_snapshot_file("snapshot.json");

    let homestead_address = Address::from_str(
        &env,
        &"CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA",
    );

    let tractor_address = env.register(KaleTractorContract, (homestead_address,));
    let tractor_client = KaleTractorContractClient::new(&env, &tractor_address);

    let farmer = Address::from_str(
        &env,
        &"GBQZZ54DGBXZ6USGU5PMMAJVDLALGEMXXZEZC5BDDSAG7FI653DLMVTN",
    );
    let rewards = tractor_client.harvest(
        &farmer,
        &vec![&env, 0, 1, 2, 3, 11692, 11697, 11698, 11699, 11700, 11701],
    );

    assert!(!rewards.is_empty());
    assert!(rewards.iter().all(|r| r >= 0));
    assert_eq!(rewards.iter().sum::<i128>(), 21566344);
    assert_eq!(rewards.len(), 10);
}
