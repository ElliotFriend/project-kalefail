use soroban_sdk::{panic_with_error, Address, Env, Vec};

use crate::{errors::Errors, types::Storage, WEEK_OF_LEDGERS};

pub fn extend_instance_ttl(env: &Env) {
    let max_ttl = env.storage().max_ttl();

    env.storage()
        .instance()
        .extend_ttl(max_ttl - WEEK_OF_LEDGERS, max_ttl);
}

pub fn get_is_open(env: &Env) -> bool {
    env.storage().instance().get(&Storage::IsOpen).unwrap()
}

pub fn check_is_open(env: &Env) {
    if !get_is_open(env) {
        panic_with_error!(env, Errors::TradingPostClosed);
    }
}

pub fn check_is_closed(env: &Env) {
    if get_is_open(env) {
        panic_with_error!(env, Errors::TradingPostOpen);
    }
}

pub fn set_is_open(env: &Env, status: bool) {
    env.storage().instance().set(&Storage::IsOpen, &status);
}

pub fn set_owner(env: &Env, owner: &Address) {
    env.storage().instance().set(&Storage::Owner, &owner);
}

pub fn get_owner(env: &Env) -> Address {
    env.storage().instance().get(&Storage::Owner).unwrap()
}

pub fn set_kale_address(env: &Env, kale: &Address) {
    env.storage().instance().set(&Storage::KaleAddress, kale);
}

pub fn get_kale_address(env: &Env) -> Address {
    env.storage().instance().get(&Storage::KaleAddress).unwrap()
}

pub fn set_max_vegetables(env: &Env, maximum: &u32) {
    env.storage()
        .instance()
        .set(&Storage::MaxVegetables, &maximum);
}

pub fn get_max_vegetables(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Storage::MaxVegetables)
        .unwrap()
}

pub fn set_vegetables_for_trade(env: &Env, vegetables: &Vec<Address>) {
    env.storage()
        .instance()
        .set(&Storage::Vegetables, vegetables);
}

pub fn get_vegetables_for_trade(env: &Env) -> Vec<Address> {
    env.storage().instance().get(&Storage::Vegetables).unwrap()
}
