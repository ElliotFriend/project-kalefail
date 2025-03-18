#![no_std]

use soroban_sdk::{
    contract, contractclient, contractimpl, contractmeta, symbol_short, Address, Env, Symbol, Vec,
};

contractmeta!(key = "title", val = "KaleFail Tractor",);
contractmeta!(
    key = "desc",
    val = "Harvest all available KALE for your farmer.",
);
contractmeta!(key = "binver", val = "1.0.0",);

const FARM: Symbol = symbol_short!("FARM");
const DAY_OF_LEDGERS: u32 = 60 * 60 * 24 / 5; // assumes 5-second ledger close times
const WEEK_OF_LEDGERS: u32 = DAY_OF_LEDGERS * 7;

#[contractclient(name = "FarmClient")]
pub trait Farm {
    fn harvest(env: Env, farmer: Address, index: u32) -> i128;
}

pub fn extend_instance_ttl(env: &Env) {
    let max_ttl = env.storage().max_ttl();
    env.storage()
        .instance()
        .extend_ttl(max_ttl - WEEK_OF_LEDGERS, max_ttl);
}

#[contract]
pub struct KaleTractorContract;

#[contractimpl]
impl KaleTractorContract {
    pub fn __constructor(env: Env, farm: Address) {
        env.storage().instance().set(&FARM, &farm);
        extend_instance_ttl(&env);
    }

    /// Harvest multiple pails available for your KALE farmer.
    ///
    /// # Arguments
    ///
    /// - `farmer` - address of the farmer to harvest on behalf of
    /// - `pails` - vector of pails which should be harvested
    pub fn harvest(env: Env, farmer: Address, pails: Vec<u32>) -> i128 {
        let mut total_reward: i128 = 0;
        let farm_address: Address = env.storage().instance().get(&FARM).unwrap();
        let farm_client = FarmClient::new(&env, &farm_address);

        pails.iter().for_each(|pail| {
            let reward = farm_client.harvest(&farmer, &pail);
            total_reward += reward;
        });

        extend_instance_ttl(&env);

        return total_reward;
    }
}

mod test;
