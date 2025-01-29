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
    /// Trade between `KALE` and some other, related vegetable.
    ///
    /// # Arguments
    ///
    /// * `customer` - The address of a customer making the trade.
    /// * `vegetable` - The SAC address of the vegetable which should be traded
    ///   against `KALE`.
    /// * `amount` - The amount of tokens (in stroops) which should be exchanged
    ///   between the customer and the trading post.
    /// * `buy_kale` - Whether or not the customer should receive `KALE` or the
    ///   other vegetable.
    ///
    /// # Panics
    ///
    /// * If the trading post is not open for business.
    /// * If the desired vegetable token is not in the list of available
    ///   vegetables.
    /// * If the trading post contract does not have a high enough `KALE`
    ///   balance to send to the customer (if buying `KALE`).
    fn trade(env: Env, customer: Address, vegetable: Address, amount: i128, buy_kale: bool) {
        // make sure the trading post is open for business
        check_is_open(&env);

        // require authorization from the customer
        customer.require_auth();

        // make sure the desired vegetable token is available for trade
        let vegetables_for_trade = get_vegetables_for_trade(&env);
        if !vegetables_for_trade.contains(&vegetable) {
            panic_with_error!(&env, Errors::InvalidVegetable);
        }

        // create the token client for `KALE`
        let kale_address = get_kale_address(&env);
        let kale_client = token::Client::new(&env, &kale_address);

        if buy_kale {
            // the customer is receiving kale and sending a vegetable. so, we
            // will only need a regular SAC client
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
        } else {
            // the customer is sending kale and receiving a vegetable. so, we
            // will `mint`, and we need an admin client
            let vegetable_client = token::StellarAssetClient::new(&env, &vegetable);

            // transfer the KALE from the customer
            kale_client.transfer(&customer, &env.current_contract_address(), &amount);
            // mint same amount of the desired vegetable
            vegetable_client.mint(&customer, &amount);
        }

        extend_instance_ttl(&env);
    }
}
