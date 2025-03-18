#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _, Env,
};

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
