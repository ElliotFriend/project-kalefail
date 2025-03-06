use crate::{
    storage::{
        extend_instance_ttl, get_is_open, get_kale_address, get_max_vegetables, get_owner, get_vegetables_for_trade, set_kale_address, set_max_vegetables, set_vegetables_for_trade
    },
    TradingPostContractArgs,
};

use soroban_sdk::{
    contractimpl,
    panic_with_error, token, Address, BytesN, Env, Vec,
};

use crate::{
    errors::Errors,
    storage::{check_is_closed, set_is_open, set_owner},
    OwnerTrait, TradingPostContract, TradingPostContractClient, DEFAULT_MAX_VEGETABLES_AVAILABLE,
};

/// An administrative interface for a trading post contract. Open or close the
/// trading post, add new vegetables, remove out-of-season ones, reconfigure
/// available shelf space, etc.
#[contractimpl]
impl OwnerTrait for TradingPostContract {
    /// Initializes the trading post and sets things up to begin further
    /// configuration.
    ///
    /// # Arguments
    ///
    /// * `owner` - The address which will be the owner and administrator of the
    ///   trading post.
    /// * `kale` - The address of the `KALE` asset contract.
    /// * `vegetables` - (optional) A vector of assets that will be available
    ///   for trading.
    /// * `max_vegetables` - (optional) The maximum number of vegetables that
    ///   should be available to trade. Defaults to 4.
    fn __constructor(
        env: Env,
        owner: Address,
        kale: Address,
        vegetables: Option<Vec<Address>>,
        max_vegetables: Option<u32>,
    ) {
        // require authorization from the owner address.
        owner.require_auth();

        // set the instance storage entry for the admin address.
        set_owner(&env, &owner);
        // set the instance storage entry for the `KALE` SAC address.
        set_kale_address(&env, &kale);
        // set the instance storage entry for the open status to false.
        set_is_open(&env, false);

        // set the instance storage entry for the maximum vegetables.
        let maximum = max_vegetables.unwrap_or(DEFAULT_MAX_VEGETABLES_AVAILABLE);
        set_max_vegetables(&env, &maximum);

        // set the instance storage entry for the vegetables available for
        // trade. if not provided in the invocation, use an empty vector.
        let passed_vegetables = vegetables.unwrap_or(Vec::new(&env));
        if passed_vegetables.len() > maximum {
            panic_with_error!(&env, Errors::TooManyVegetables);
        }
        set_vegetables_for_trade(&env, &passed_vegetables);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Upgrade the contract's Wasm bytecode. The trading post must be closed
    /// before invoking this function.
    ///
    /// # Arguments
    ///
    /// * `new_wasm_hash` - Hash identifier for the bytecode that should be
    ///   henceforth used by this contract. The bytecode must already be
    ///   installed and present on-chain.
    ///
    /// # Panics
    ///
    /// * If the trading post is still open.
    /// * If the Wasm bytecode is not already installed on-chain.
    fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        // before we upgrade the trading post, it should be closed. this gives
        // us time for further config stuff, if we need to do some of that.
        check_is_closed(&env);

        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // update the contract Wasm bytecode
        env.deployer().update_current_contract_wasm(new_wasm_hash);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Add more vegetables which will be available to trade for using `KALE`
    /// tokens.
    ///
    /// # Arguments
    ///
    /// * `vegetables_to_add` - A vector of vegetable asset contract addresses.
    ///
    /// # Panics
    ///
    /// * If a vegetable to be added is already available for trade.
    /// * If the trading post is open for trading, but the SAC admin of a
    ///   provided vegetable contract is not the trading post contract address.
    fn add_vegetables(env: Env, vegetables_to_add: Vec<Address>) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // retrieve the existing vegetables available
        let mut vegetables_for_trade = get_vegetables_for_trade(&env);

        // make sure we won't exceed the maximum number of vegetables
        let max_vegetables: u32 = get_max_vegetables(&env);
        if vegetables_for_trade.len() == max_vegetables
            || vegetables_for_trade.len() + vegetables_to_add.len() > max_vegetables
        {
            panic_with_error!(&env, Errors::TooManyVegetables)
        }

        // see if the trading post is currently open, so we know if we need to
        // check for a SAC admin on the vegetable contracts
        let is_open = get_is_open(&env);

        // iterate through all the vegetables, adding or panicking as needed
        for vegetable in vegetables_to_add {
            if vegetables_for_trade.contains(&vegetable) {
                // this vegetable is already available for trade: panic!
                panic_with_error!(&env, Errors::VegetableAlreadyForTrade);
            } else {
                // add the vegetable to the vector of available ones
                vegetables_for_trade.push_back(vegetable.clone());

                // if the trading post is open, make sure it is a SAC admin for
                // the provided vegetable
                if is_open {
                    let vegetable_client = token::StellarAssetClient::new(&env, &vegetable);
                    let vegetable_admin = vegetable_client.admin();

                    if vegetable_admin != env.current_contract_address() {
                        panic_with_error!(&env, Errors::ContractNotSacAdmin);
                    }
                }
            }
        }

        // set the storage entry
        set_vegetables_for_trade(&env, &vegetables_for_trade);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Remove vegetables so they will no longer be available to trade for using
    /// `KALE` tokens.
    ///
    /// # Arguments
    ///
    /// * `vegetables_to_remove` - A vector of vegetable asset contract
    ///   addresses.
    ///
    /// # Panics
    ///
    /// * If a vegetable to be removed is not already available for trade.
    fn remove_vegetables(env: Env, vegetables_to_remove: Vec<Address>) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // retrieve the current vegetables available for trade
        let mut vegetables_for_trade = get_vegetables_for_trade(&env);

        // iterate through all the vegetables, removing or panicking as needed
        for vegetable in vegetables_to_remove {
            if !vegetables_for_trade.contains(&vegetable) {
                // this vegetable is not even available for trade: panic!
                panic_with_error!(&env, Errors::VegetableNotForTrade);
            } else {
                // find the index of the provided vegetable and remove it
                let v_index = vegetables_for_trade.first_index_of(&vegetable).unwrap();
                vegetables_for_trade.remove(v_index);
            }
        }

        // set the storage entry
        set_vegetables_for_trade(&env, &vegetables_for_trade);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Increase the maximum number of vegetables available for trade.
    ///
    /// # Arguments
    ///
    /// * `new_max_vegetables` - The new maximum number of vegetables that can
    ///   be available to trade.
    ///
    /// # Panics
    ///
    /// * If the existing maximum is greater than the provided new maximum.
    /// * If the existing maximum is equal to the provided new maximum. Why even
    ///   bother then?
    fn grow_shelf_space(env: Env, new_max_vegetables: u32) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // make sure the currently configured maximum isn't bigger than the new
        let max_vegetables: u32 = get_max_vegetables(&env);
        if max_vegetables >= new_max_vegetables {
            panic_with_error!(&env, Errors::ShelfAlreadyBigger);
        }

        // set the storage entry
        set_max_vegetables(&env, &new_max_vegetables);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Decrease the maximum number of vegetables available for trade.
    ///
    /// # Arguments
    ///
    /// * `new_max_vegetables` - The new maximum number of vegetables that can
    ///   be available to trade.
    ///
    /// # Panics
    ///
    /// * If the existing maximum is less than the provided new maximum.
    /// * If the existing maximum is equal to the provided new maximum. Why even
    ///   bother then?
    /// * If the number of available vegetables would be bigger than the new
    ///   maximum.
    fn shrink_shelf_space(env: Env, new_max_vegetables: u32) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // make sure the currently configured maximum isn't smaller than the new
        let max_vegetables: u32 = get_max_vegetables(&env);
        if max_vegetables <= new_max_vegetables {
            panic_with_error!(&env, Errors::ShelfAlreadySmaller);
        }

        // make sure there are not currently more vegetables than new maximum
        let vegetables_for_trade = get_vegetables_for_trade(&env);

        if vegetables_for_trade.len() > new_max_vegetables {
            panic_with_error!(&env, Errors::TooManyVegetables);
        }

        // set the storage entry
        set_max_vegetables(&env, &new_max_vegetables);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Open the trading post for business. The trading post is closed _by
    /// default_, so this function will need to be invoked before trading can
    /// begin.
    ///
    /// # Panics
    ///
    /// * If there are no vegetable assets available for trade.
    /// * If one or more of the available vegetable assets does not have a SAC
    ///   admin set to this trading post contract's address.
    fn open(env: Env) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // make sure there are actually some vegetables available to trade
        let vegetables_for_trade = get_vegetables_for_trade(&env);
        if vegetables_for_trade.len() < 1 {
            panic_with_error!(&env, Errors::VegetablesRequired);
        }

        // make sure all the vegetables available for trade have the trading
        // post set as the SAC admin address
        for vegetable in &vegetables_for_trade {
            let v_client = token::StellarAssetClient::new(&env, &vegetable);
            let v_admin = v_client.admin();

            if v_admin != env.current_contract_address() {
                panic_with_error!(&env, Errors::ContractNotSacAdmin);
            }
        }

        // set the storage entry
        set_is_open(&env, true);

        // extend the contract's TTL
        extend_instance_ttl(&env);
    }

    /// Close the trading post.
    fn close(env: Env) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        // set the storage entry
        set_is_open(&env, false);

        // no `extend_instance_ttl` as we're closing up shop
    }

    /// The airdrop changed from 500x to 501x, which left the trading post with
    /// a small surplus of KALE. Let's burn it to balance out the sKALEs.
    fn burn_the_extra_kale(env: Env) {
        // require authorization from the owner address.
        let owner = get_owner(&env);
        owner.require_auth();

        let kale_address = get_kale_address(&env);
        let kale_client = token::Client::new(&env, &kale_address);

        let tp_kale_balance = kale_client.balance(&env.current_contract_address());
        let amount_to_burn = tp_kale_balance - (4364 * 10_000_000);
        kale_client.burn(&env.current_contract_address(), &amount_to_burn);
    }
}
