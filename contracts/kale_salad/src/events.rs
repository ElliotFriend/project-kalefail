use soroban_sdk::{symbol_short, Address, Env, Symbol};

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
