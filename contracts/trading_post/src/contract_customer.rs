use crate::{
    storage::{get_kale_address, get_vegetables_for_trade},
    TradingPostContractArgs,
};
use soroban_sdk::{contractimpl, panic_with_error, token, Address, Env};

use crate::{
    errors::Errors,
    storage::{check_is_open, extend_instance_ttl},
    CustomerTrait, TradingPostContract, TradingPostContractClient,
};

/// A customer interface for a trading post contract. Swap KALE that has been
/// acquired for a variety of new and exciting (yet still the same) vegetables.
#[contractimpl]
impl CustomerTrait for TradingPostContract {
    /// Trade some `KALE` for another specified vegetable token.
    ///
    /// # Arguments
    ///
    /// * `customer` - The address of a customer making the trade.
    /// * `vegetable` - The SAC address of the vegetable which should be sent to
    ///   the customer.
    /// * `amount` - The amount of `KALE` (in stroops) which should be exchanged
    ///   for the same amount of the desired vegetable.
    ///
    /// # Panics
    ///
    /// * If the trading post is not open for business.
    /// * If the desired vegetable token is not in the list of available
    ///   vegetables.
    fn trade(env: Env, customer: Address, vegetable: Address, amount: i128) {
        // make sure the trading post is open for business
        check_is_open(&env);

        // require authorization from the customer
        customer.require_auth();

        // make sure the desired vegetable token is available for trade
        let vegetables_for_trade = get_vegetables_for_trade(&env);
        if !vegetables_for_trade.contains(&vegetable) {
            panic_with_error!(&env, Errors::InvalidVegetable);
        }

        // create a token client for `KALE` and an admin client for the desired
        // vegetable.
        let kale_address = get_kale_address(&env);
        let kale_client = token::Client::new(&env, &kale_address);
        let vegetable_client = token::StellarAssetClient::new(&env, &vegetable);

        // transfer the KALE from the customer
        kale_client.transfer(&customer, &env.current_contract_address(), &amount);
        // mint same amount of the desired vegetable
        vegetable_client.mint(&customer, &amount);

        extend_instance_ttl(&env);
    }

    /// Trade some other vegetable for some `KALE`.
    ///
    /// # Arguments
    ///
    /// * `customer` - The address of a customer making the trade.
    /// * `vegetable` - The SAC address of the vegetable which should be traded
    ///   for `KALE`.
    /// * `amount` - The amount of `KALE` (in stroops) which should be sent to
    ///   the customer in exchange for the same amount of the sent vegetable.
    ///
    /// # Panics
    ///
    /// * If the trading post is not open for business.
    /// * If the desired vegetable token is not in the list of available
    ///   vegetables.
    /// * If the trading post contract does not have a high enough `KALE`
    ///   balance to make the trade.
    fn trade_for_kale(env: Env, customer: Address, vegetable: Address, amount: i128) {
        // make sure the trading post is open for business
        check_is_open(&env);

        // require authorization from the customer
        customer.require_auth();

        // make sure the desired vegetable token is available for trade
        let vegetables_for_trade = get_vegetables_for_trade(&env);
        if !vegetables_for_trade.contains(&vegetable) {
            panic_with_error!(&env, Errors::InvalidVegetable);
        }

        // create a token client for `KALE` and an admin client for the desired
        // vegetable.
        let kale_address = get_kale_address(&env);
        let kale_client = token::Client::new(&env, &kale_address);
        let vegetable_client = token::Client::new(&env, &vegetable);

        // ensure we have enough KALE to facilitate the trade
        let balance = kale_client.balance(&env.current_contract_address());
        if balance < amount {
            panic_with_error!(&env, Errors::NotEnoughKale);
        }

        // burn the vegetable provided by the customer
        vegetable_client.burn(&customer, &amount);
        // transfer KALE to the customer
        kale_client.transfer(&env.current_contract_address(), &customer, &amount);

        extend_instance_ttl(&env);
    }
}
