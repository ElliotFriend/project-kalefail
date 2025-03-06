#![no_std]

use soroban_sdk::{contract, contractmeta, Address, BytesN, Env, Vec};

contractmeta!(
    key = "title",
    val = "KaleFail Trading Post",
);
contractmeta!(
    key = "desc",
    val = "Exchange your hard-earned KALE tokens for other, related vegetables."
);
contractmeta!(
    key = "ver",
    val = "1.2.0"
);

mod contract_customer;
mod contract_owner;
mod errors;
mod storage;
mod test;
mod types;

const DEFAULT_MAX_VEGETABLES_AVAILABLE: u32 = 4; // the default maximum number of vegetables available for trading
const WEEK_OF_LEDGERS: u32 = 60 * 60 * 24 / 5 * 7; // assumes 5 second ledger close times

#[contract]
pub struct TradingPostContract;

pub trait OwnerTrait {
    fn __constructor(
        env: Env,
        owner: Address,
        kale: Address,
        vegetables: Option<Vec<Address>>,
        max_vegetables: Option<u32>,
    );

    fn upgrade(env: Env, new_wasm_hash: BytesN<32>);

    fn add_vegetables(env: Env, vegetables_to_add: Vec<Address>);

    fn remove_vegetables(env: Env, vegetables_to_remove: Vec<Address>);

    fn grow_shelf_space(env: Env, new_max_vegetables: u32);

    fn shrink_shelf_space(env: Env, new_max_vegetables: u32);

    fn open(env: Env);

    fn close(env: Env);

    fn burn_the_extra_kale(env: Env);
}

pub trait CustomerTrait {
    fn trade(env: Env, customer: Address, vegetable: Address, amount: i128, buy_kale: bool);
}
