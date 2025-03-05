use soroban_sdk::{panic_with_error, Address, Env, String, Vec};

use crate::{
    constants::{DAY_OF_LEDGERS, MAXIMUM_TOKENS_TO_BE_MINTED, WEEK_OF_LEDGERS},
    errors::Errors,
    types::{ApprovedData, Metadata, Storage},
};

pub fn set_metadata(env: &Env, name: String, symbol: String, uri: String) {
    let metadata = Metadata {
        name,
        symbol,
        base_uri: uri,
    };
    env.storage().instance().set(&Storage::Metadata, &metadata);
}

pub fn get_metadata(env: &Env) -> Metadata {
    env.storage()
        .instance()
        .get(&Storage::Metadata)
        .unwrap_or_else(|| panic_with_error!(env, Errors::UnsetMetadata))
}

pub fn set_supply(env: &Env, supply: &u32) {
    env.storage().instance().set(&Storage::Supply, supply);
}

pub fn get_supply(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Storage::Supply)
        .unwrap_or_default()
}

pub fn decrement_supply(env: &Env) {
    env.storage().instance().update(&Storage::Supply, |s| {
        (s.unwrap_or_default() as u32).checked_sub(1).unwrap()
    });
}

pub fn set_mint_index(env: &Env, index: &u32) {
    env.storage().instance().set(&Storage::MintIndex, index);
}

pub fn get_mint_index(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Storage::MintIndex)
        .unwrap_or_default()
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&Storage::Admin, admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&Storage::Admin).unwrap()
}

pub fn token_exists(env: &Env, token_id: &u32) -> bool {
    token_id < &MAXIMUM_TOKENS_TO_BE_MINTED
        && env.storage().persistent().has(&Storage::Owner(*token_id))
}

pub fn set_tokens_owned(env: &Env, owner: &Address, tokens_owned: &Vec<u32>) {
    env.storage()
        .persistent()
        .set(&Storage::Balance(owner.clone()), tokens_owned);

    extend_balance_ttl(env, owner);
}

pub fn get_tokens_owned(env: &Env, owner: &Address) -> Vec<u32> {
    env.storage()
        .persistent()
        .get(&Storage::Balance(owner.clone()))
        .unwrap_or_else(|| Vec::new(&env))
}

pub fn clear_tokens_owned(env: &Env, owner: &Address) {
    env.storage()
        .persistent()
        .remove(&Storage::Balance(owner.clone()));
}

/// Removes the NFT token from the balance vector of `owner`, panicking if the
/// vector does not contain the passed token id
pub fn spend_token(env: &Env, owner: &Address, token_id: &u32) {
    let mut balance = get_tokens_owned(env, owner);

    // make sure the owner actually _owns_ this token
    if !balance.contains(token_id) {
        panic_with_error!(env, Errors::IncorrectOwner);
    }

    balance.remove(balance.first_index_of(token_id).unwrap());

    if balance.len() > 0 {
        // owner still has other tokens, save to storage
        set_tokens_owned(env, owner, &balance);
    } else {
        // no tokens left for owner, remove storage
        clear_tokens_owned(env, owner);
    }
}

pub fn add_token(env: &Env, owner: &Address, token_id: &u32) {
    let mut balance = get_tokens_owned(env, owner);

    if balance.contains(token_id) {
        // panic b/c the owner already owns this token
        panic_with_error!(env, Errors::IncorrectOwner);
    }

    balance.push_back(*token_id);
    set_tokens_owned(env, owner, &balance);
}

pub fn set_token_owner(env: &Env, token_id: &u32, owner: &Address) {
    env.storage()
        .persistent()
        .set(&Storage::Owner(token_id.clone()), owner);

    extend_owner_ttl(env, token_id);
}

pub fn get_token_owner(env: &Env, token_id: &u32) -> Address {
    env.storage()
        .persistent()
        .get(&Storage::Owner(token_id.clone()))
        .unwrap()
}

pub fn is_token_owner(env: &Env, owner: &Address, token_id: &u32) -> bool {
    get_token_owner(env, token_id) == owner.clone()
}

pub fn burn_token(env: &Env, token_id: &u32) {
    env.storage()
        .persistent()
        .remove(&Storage::Owner(token_id.clone()));
}

pub fn set_vegetables(env: &Env, vegetables: &Vec<Address>) {
    env.storage()
        .instance()
        .set(&Storage::Vegetables, vegetables);
}

pub fn get_vegetables(env: &Env) -> Vec<Address> {
    env.storage().instance().get(&Storage::Vegetables).unwrap()
}

pub fn set_payment_per_token(env: &Env, payment: &i128) {
    env.storage()
        .instance()
        .set(&Storage::PaymentPerToken, payment);
}

pub fn get_payment_per_token(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&Storage::PaymentPerToken)
        .unwrap()
}

pub fn set_approved_data(env: &Env, spender: &Address, token_id: &u32, expiration_ledger: &u32) {
    let key = Storage::Approved(token_id.clone());
    let approved_data = ApprovedData {
        spender: spender.clone(),
        expiration_ledger: expiration_ledger.clone(),
    };

    env.storage().temporary().set(&key, &approved_data);
    extend_approved_data(env, &key, expiration_ledger);
}

pub fn get_approved_data(env: &Env, token_id: &u32) -> Option<ApprovedData> {
    if let Some(approved_data) = env
        .storage()
        .temporary()
        .get::<_, ApprovedData>(&Storage::Approved(*token_id))
    {
        if approved_data.expiration_ledger < env.ledger().sequence() {
            None
        } else {
            Some(approved_data)
        }
    } else {
        None
    }
}

pub fn extend_approved_data(env: &Env, key: &Storage, expiration_ledger: &u32) {
    let live_for = expiration_ledger
        .checked_sub(env.ledger().sequence())
        .unwrap();
    env.storage()
        .temporary()
        .extend_ttl(key, live_for, live_for);
}

pub fn clear_approved_data(env: &Env, token_id: &u32) {
    env.storage()
        .temporary()
        .remove(&Storage::Approved(*token_id));
}

pub fn set_approved_all_data(
    env: &Env,
    owner: &Address,
    spender: &Address,
    expiration_ledger: &u32,
) {
    let key = Storage::ApprovedAll(owner.clone());
    let approved_data = ApprovedData {
        spender: spender.clone(),
        expiration_ledger: expiration_ledger.clone(),
    };

    env.storage().temporary().set(&key, &approved_data);
    extend_approved_data(env, &key, expiration_ledger);
}

pub fn get_approved_all_data(env: &Env, owner: &Address) -> Option<ApprovedData> {
    if let Some(approval) = env
        .storage()
        .temporary()
        .get::<_, ApprovedData>(&Storage::ApprovedAll(owner.clone()))
    {
        if approval.expiration_ledger < env.ledger().sequence() {
            None
        } else {
            Some(approval)
        }
    } else {
        None
    }
}

pub fn clear_approved_all_data(env: &Env, owner: &Address) {
    env.storage()
        .temporary()
        .remove(&Storage::ApprovedAll(owner.clone()));
}

pub fn spender_is_approved(env: &Env, owner: &Address, spender: &Address, token_id: &u32) -> bool {
    let approved_all = match get_approved_all_data(&env, &owner) {
        Some(data) => data.spender == spender.clone(),
        _ => false,
    };
    let approved = match get_approved_data(&env, &token_id) {
        Some(data) => data.spender == spender.clone(),
        _ => false,
    };

    return approved || approved_all;
}

pub fn extend_instance_ttl(env: &Env) {
    let max_ttl = env.storage().max_ttl();

    env.storage()
        .instance()
        .extend_ttl(max_ttl - WEEK_OF_LEDGERS, max_ttl);
}

pub fn extend_balance_ttl(env: &Env, owner: &Address) {
    let max_ttl = env.storage().max_ttl();

    env.storage().persistent().extend_ttl(
        &Storage::Balance(owner.clone()),
        max_ttl - DAY_OF_LEDGERS,
        max_ttl,
    );
}

pub fn extend_owner_ttl(env: &Env, token_id: &u32) {
    let max_ttl = env.storage().max_ttl();

    env.storage().persistent().extend_ttl(
        &Storage::Owner(token_id.clone()),
        max_ttl - DAY_OF_LEDGERS,
        max_ttl,
    );
}
