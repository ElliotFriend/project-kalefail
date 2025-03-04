use soroban_sdk::{symbol_short, Address, Env, Symbol};

use crate::types::Storage;

pub fn emit_transfer(env: &Env, from: &Address, to: &Address, token_id: &u32) {
    let topics = (symbol_short!("transfer"), from, to);
    env.events().publish(topics, token_id);
}

pub fn emit_approve(
    env: &Env,
    owner: &Address,
    spender: &Address,
    token_id: &u32,
    expiration_ledger: &u32,
) {
    let topics = (symbol_short!("approve"), owner, spender);
    env.events().publish(topics, (token_id, expiration_ledger));
}

pub fn emit_approve_all(env: &Env, owner: &Address, spender: &Address, expiration_ledger: &u32) {
    let topics = (Symbol::new(env, "approve_all"), owner);
    env.events().publish(topics, (spender, expiration_ledger));
}

pub fn emit_burn(env: &Env, owner: &Address, token_id: &u32) {
    let topics = (symbol_short!("burn"), owner);
    env.events().publish(topics, token_id);
}

pub fn emit_mint(env: &Env, owner: &Address, token_id: &u32) {
    let issuer: Address = env.storage().instance().get(&Storage::Issuer).unwrap();
    let topics = (symbol_short!("mint"), issuer, owner);
    env.events().publish(topics, token_id);
}
