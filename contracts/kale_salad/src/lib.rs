#![no_std]

use constants::{MAXIMUM_TOKENS_PER_ADDRESS, MAXIMUM_TOKENS_TO_BE_MINTED};
use errors::Errors;
use events::{emit_approve, emit_approve_all, emit_burn, emit_transfer};
use soroban_nft_interface::{
    NonFungibleTokenEnumerable, NonFungibleTokenInterface, NonFungibleTokenMetadata,
};
use soroban_sdk::{
    contract, contractimpl, contractmeta, panic_with_error, token, Address, BytesN, Env, String,
    Vec,
};
use storage::{
    add_token, burn_token, clear_approved_all_data, clear_approved_data, decrement_supply,
    get_approved_all_data, get_approved_data, get_issuer, get_metadata, get_mint_index,
    get_payment_per_token, get_supply, get_token_owner, get_tokens_owned, get_vegetables,
    is_token_owner, set_approved_all_data, set_approved_data, set_issuer, set_metadata,
    set_mint_index, set_payment_per_token, set_supply, set_token_owner, set_tokens_owned,
    set_vegetables, spend_token, spender_is_approved, token_exists,
};
use types::Storage;
use utils::u8_to_string;

contractmeta!(key = "Title", val = "KALE Salad");
contractmeta!(
    key = "Description",
    val = "Combine your wonderful produce into a delightful, healthy salad NFT."
);
contractmeta!(key = "ver", val = "0.0.1");

mod constants;
mod errors;
mod events;
mod storage;
mod tests;
mod types;
mod utils;

#[contract]
pub struct KaleSaladContract;

#[contractimpl]
impl KaleSaladContract {
    pub fn __constructor(
        env: Env,
        issuer: Address,
        nft_name: String,
        nft_symbol: String,
        base_uri: String,
        vegetables: Vec<Address>,
        payment_each_vegetable: i128,
    ) {
        if vegetables.len() < 4 {
            panic_with_error!(&env, Errors::TooFewVegetables);
        }

        issuer.require_auth();

        set_issuer(&env, &issuer);
        set_vegetables(&env, &vegetables);
        set_payment_per_token(&env, &(payment_each_vegetable * vegetables.len() as i128));
        set_metadata(&env, nft_name, nft_symbol, base_uri);


        set_supply(&env, &0u32);
        set_mint_index(&env, &0u32);
    }

    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        // require authorization from the issuer address.
        let issuer = get_issuer(&env);
        issuer.require_auth();

        // update the contract Wasm bytecode
        env.deployer().update_current_contract_wasm(new_wasm_hash);

        // extend the contract's TTL
        // extend_instance_ttl(&env);
    }

    pub fn mint_salad(
        env: Env,
        owner: Address,
        payment_each_vegetable: i128,
        number_of_tokens: u32,
    ) {
        owner.require_auth();

        let mut mint_index = get_mint_index(&env);
        if mint_index >= MAXIMUM_TOKENS_TO_BE_MINTED {
            panic_with_error!(&env, Errors::TooManyTokens);
        }
        // if get_mint_index(&env) {}

        if number_of_tokens > MAXIMUM_TOKENS_PER_ADDRESS {
            panic_with_error!(&env, Errors::TooManyTokens);
        }

        if env
            .storage()
            .persistent()
            .has(&Storage::Balance(owner.clone()))
        {
            let current_balance: Vec<u32> = env
                .storage()
                .persistent()
                .get(&Storage::Balance(owner.clone()))
                .unwrap();
            let future_balance = current_balance.len() + number_of_tokens;
            if future_balance > MAXIMUM_TOKENS_PER_ADDRESS {
                panic_with_error!(&env, Errors::TooManyTokens);
            }
        }

        let payment_per_token = get_payment_per_token(&env);
        let minimum_payment = payment_per_token * number_of_tokens as i128;
        let total_payment = payment_each_vegetable * 4 * number_of_tokens as i128;
        if total_payment < minimum_payment {
            panic_with_error!(&env, Errors::InsufficientPayment);
        }

        // burn the payment amount from each vegetable
        let vegetables = get_vegetables(&env);
        for vegetable in vegetables {
            let vegetable_client = token::Client::new(&env, &vegetable);
            vegetable_client.burn(&owner, &payment_each_vegetable);
        }

        let supply = get_supply(&env);
        // let mut mint_index = get_mint_index(&env);
        let mut tokens_owned = get_tokens_owned(&env, &owner);

        for _ in 0..number_of_tokens {
            tokens_owned.push_back(mint_index);
            set_token_owner(&env, &mint_index, &owner);
            mint_index += 1;
        }

        set_supply(&env, &(supply + number_of_tokens));
        set_mint_index(&env, &mint_index);
        set_tokens_owned(&env, &owner, tokens_owned);
    }

    pub fn base_uri(env: Env) -> String {
        get_metadata(&env).base_uri
    }

    pub fn decimals() -> u32 {
        return 0u32;
    }

    pub fn burn(env: Env, owner: Address, token_id: u32) {
        owner.require_auth();

        // if the token_id does not exist, panic
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        // remove the token from owner's balance vector
        spend_token(&env, &owner, &token_id);
        // remove the token's storage entry
        burn_token(&env, &token_id);

        // remove any approved data that may be around
        clear_approved_data(&env, &token_id);
        // decrement the total supply
        decrement_supply(&env);

        // emit an event
        emit_burn(&env, &owner, &token_id);
    }

    pub fn burn_from(env: Env, spender: Address, owner: Address, token_id: u32) {
        spender.require_auth();

        // if the token_id does not exist, panic
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        // check spender is approved
        if !spender_is_approved(&env, &owner, &spender, &token_id) {
            panic_with_error!(&env, Errors::InvalidSpender);
        }

        // remove the token from owner's balance vector
        spend_token(&env, &owner, &token_id);
        // remove the token's storage entry
        burn_token(&env, &token_id);

        // remove any approved data that may be around
        clear_approved_data(&env, &token_id);
        // decrement the total supply
        decrement_supply(&env);

        // emit an event
        emit_burn(&env, &owner, &token_id);
    }
}

#[contractimpl]
impl NonFungibleTokenMetadata for KaleSaladContract {
    fn name(env: Env) -> String {
        return get_metadata(&env).name;
    }

    fn symbol(env: Env) -> String {
        return get_metadata(&env).symbol;
    }

    fn token_uri(env: Env, token_id: u32) -> String {
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        let base_uri = get_metadata(&env).base_uri;
        let token_id_str = u8_to_string(&env, token_id as u8);
        let base_uri_len = base_uri.len() as usize;
        let token_id_str_len = token_id_str.len() as usize;
        let combined_len = base_uri_len + token_id_str_len;

        let mut slice: [u8; 70] = [0; 70];
        base_uri.copy_into_slice(&mut slice[..base_uri_len]);
        token_id_str.copy_into_slice(&mut slice[base_uri_len..combined_len]);

        return String::from_bytes(&env, &slice[..combined_len]);
    }
}

#[contractimpl]
impl NonFungibleTokenEnumerable for KaleSaladContract {
    fn total_supply(env: Env) -> u32 {
        get_supply(&env)
    }

    fn token_by_index(env: Env, index: u32) -> u32 {
        if index > get_supply(&env) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        return index;
    }

    fn token_of_owner_by_index(env: Env, owner: Address, index: u32) -> u32 {
        let tokens_owned = get_tokens_owned(&env, &owner);
        return tokens_owned.get(index).unwrap();
    }
}

#[contractimpl]
impl NonFungibleTokenInterface for KaleSaladContract {
    fn balance(env: Env, id: Address) -> u32 {
        let tokens_owned = get_tokens_owned(&env, &id);
        return tokens_owned.len();
    }

    fn owner_of(env: Env, token_id: u32) -> Address {
        // if the token_id does not exist, panic!
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        return get_token_owner(&env, &token_id);
    }

    fn approve(env: Env, owner: Address, spender: Address, token_id: u32, expiration_ledger: u32) {
        owner.require_auth();

        if owner == spender {
            panic_with_error!(&env, Errors::CannotApproveOwner);
        }

        // if the token_id does not exist, panic!
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        // if the owner does not own this token, panic!
        if !is_token_owner(&env, &owner, &token_id) {
            panic_with_error!(&env, Errors::InvalidApprover);
        }

        // if the expiration_ledger is 0...
        if expiration_ledger == 0 {
            if let Some(approval_data) = get_approved_data(&env, &token_id) {
                // and the current approval is indeed for `spender`
                if approval_data.spender == spender {
                    // remove the approval
                    clear_approved_data(&env, &token_id);
                } else {
                    // the current approval is different from `spender`, panic!
                    panic_with_error!(&env, Errors::InvalidApprover);
                }
            } else {
                panic_with_error!(&env, Errors::InvalidApprovalExpiration);
            }
        } else {
            // if the expiration is in the past, panic!
            if expiration_ledger < env.ledger().sequence() {
                panic_with_error!(&env, Errors::InvalidApprovalExpiration);
            }

            // otherwise set the approval
            set_approved_data(&env, &spender, &token_id, &expiration_ledger);
        }

        // emit the event
        emit_approve(&env, &owner, &spender, &token_id, &expiration_ledger);
    }

    fn get_approved(env: Env, token_id: u32) -> Option<Address> {
        // if the token_id does not exist, panic!
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        if let Some(approval_data) = get_approved_data(&env, &token_id) {
            return Some(approval_data.spender);
        } else {
            return None;
        }
    }

    fn approve_all(env: Env, owner: Address, spender: Address, expiration_ledger: u32) {
        owner.require_auth();

        if owner == spender {
            panic_with_error!(&env, Errors::CannotApproveOwner);
        }

        if expiration_ledger == 0 {
            if let Some(approval_data) = get_approved_all_data(&env, &owner) {
                // and the current approval is indeed for `spender`
                if approval_data.spender == spender {
                    // remove the approval
                    clear_approved_all_data(&env, &owner);
                } else {
                    // the current approval is different from `spender`, panic!
                    panic_with_error!(&env, Errors::InvalidApprover);
                }
            } else {
                panic_with_error!(&env, Errors::InvalidApprovalExpiration);
            }
        } else {
            // if the expiration is in the past, panic
            if expiration_ledger < env.ledger().sequence() {
                panic_with_error!(&env, Errors::InvalidApprovalExpiration);
            }

            // otherwise set the approval
            set_approved_all_data(&env, &owner, &spender, &expiration_ledger);
        }

        // emit the event
        emit_approve_all(&env, &owner, &spender, &expiration_ledger);
    }

    fn is_approved_all(env: Env, owner: Address, spender: Address) -> bool {
        if let Some(approval_data) = get_approved_all_data(&env, &owner) {
            return approval_data.spender == spender;
        } else {
            return false;
        }
    }

    fn transfer(env: Env, owner: Address, to: Address, token_id: u32) {
        owner.require_auth();

        // if the token_id does not exist, panic
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        if !is_token_owner(&env, &owner, &token_id) {
            panic_with_error!(&env, Errors::IncorrectOwner)
        }

        // remove the token from `owner`
        spend_token(&env, &owner, &token_id);
        // add the token to `to`
        add_token(&env, &to, &token_id);
        // change the token owner
        set_token_owner(&env, &token_id, &to);

        // reset the approved address for this token_id
        clear_approved_data(&env, &token_id);
        // emit the event
        emit_transfer(&env, &owner, &to, &token_id);
    }

    fn transfer_from(env: Env, spender: Address, owner: Address, to: Address, token_id: u32) {
        spender.require_auth();

        // if the token_id does not exist, panic
        if !token_exists(&env, &token_id) {
            panic_with_error!(&env, Errors::NonExistentToken);
        }

        if !is_token_owner(&env, &owner, &token_id) {
            panic_with_error!(&env, Errors::IncorrectOwner)
        }

        if !spender_is_approved(&env, &owner, &spender, &token_id) {
            panic_with_error!(&env, Errors::InvalidSpender);
        }

        // remove the token from `from`
        spend_token(&env, &owner, &token_id);
        // add the token to `to`
        add_token(&env, &to, &token_id);
        // change the token owner
        set_token_owner(&env, &token_id, &to);

        // reset the approved address for this token_id
        clear_approved_data(&env, &token_id);
        // emit the event
        emit_transfer(&env, &owner, &to, &token_id);
    }
}
