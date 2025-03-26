#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, String};

#[contracttype]
pub enum DataKey {
    Something(String) // : string
}

#[contract]
pub struct PlaygroundContract;

#[contractimpl]
impl PlaygroundContract {
    pub fn set_storage(env: Env, key: String, val: String) {
        let key = DataKey::Something(key);

        env.storage().temporary().set(&key, &val);
    }

    pub fn get_storage(env: Env, key: String) -> String {
        let key = DataKey::Something(key);

        env.storage().temporary().get(&key).unwrap_or_else(|| panic!("missing storage key"))
    }

    /// this function will attempt to delete a storage entry, but does NOT make
    /// a check to see if the storage entry exists first.
    pub fn broken_rm_storage(env: Env, key: String) {
        let key = DataKey::Something(key);

        env.storage().temporary().remove(&key);
    }

    /// this function will attempt to delete a storage entry, but DOES make a
    /// check to see if the storage entry exists first.
    pub fn working_rm_storage(env: Env, key: String) {
        let key = DataKey::Something(key);

        if env.storage().temporary().has(&key) {
            env.storage().temporary().remove(&key);
        }
    }
}
