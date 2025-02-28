#![no_std]

use soroban_sdk::{contractclient, Env, Address, String};

#[contractclient(name = "NonFungibleTokenClient")]
pub trait NonFungibleTokenInterface {
    /// Count all NFTs assigned to an owner
    ///
    /// # Arguments
    ///
    /// - `owner` - The address for which a balance is being queried. If the
    /// address has no existing NFTs, returns 0.
    fn balance(env: Env, owner: Address) -> u32;

    /// Find the owner of an NFT
    ///
    /// # Arguments
    ///
    /// - `token_id` - The identifier for an NFT.
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist (i.e., it has not yet been minted, it has
    ///   previously been burned, or it is larger than the maximum number of
    ///   NFTs).
    fn owner_of(env: Env, token_id: u32) -> Address;

    /// Transfers the ownership of an NFT from one address to another address
    ///
    /// # Arguments
    ///
    /// - `owner` - The address currently holding the NFT.
    /// - `to` - The address which will receive the transferred NFT.
    /// - `token_id` - The NFT to transfer.
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist
    /// - If `owner` is not the current holder of `token_id`
    ///
    /// # Events
    ///
    /// Emits an event with:
    /// - topics - `["transfer", owner: Address, to: Address]`
    /// - data - `token_id: u32`
    fn transfer(env: Env, owner: Address, to: Address, token_id: u32);

    /// Transfers the ownership of an NFT from one address to another address,
    /// consuming a spender's approval in the process. Authorized by spender
    /// (`spender.require_auth()`).
    ///
    /// # Arguments
    ///
    /// - `spender` - The address authorizing the transfer, and having its
    ///   approval consumed during the transfer.
    /// - `owner` - The address currently holding the NFT.
    /// - `to` - The address which will receive the transferred NFT.
    /// - `token_id` - The NFT to transfer.
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist
    /// - If `owner` is not the current holder of `token_id`
    /// - If `spender` is not authorized to perform transfers of this NFT or for
    ///   this owner's NFTs.
    ///
    /// # Events
    ///
    /// Emits an event with:
    /// - topics - `["transfer", owner: Address, to: Address]`
    /// - data - `token_id: u32`
    fn transfer_from(env: Env, spender: Address, owner: Address, to: Address, token_id: u32);

    /// Change or reaffirm the approved address for an NFT.
    ///
    /// # Arguments
    ///
    /// - `owner` - The address currently holding the NFT.
    /// - `spender` - The address being authorized to spend the NFT.
    /// - `token_id` - The NFT the `spender` is authorized to transfer.
    /// - `expiration_ledger` - The ledger number where this approval expires.
    ///   Cannot be less than the current ledger number, unless it is 0. An
    ///   expired entry (where expiration_ledger < the current ledger number)
    ///   should be treated as unapproved. If 0 is passed, this function will
    ///   remove approval for this spender on this NFT.
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist
    /// - If `owner` is not the current holder of `token_id`
    /// - If `expiration_ledger` is 0 (removing approval), and `spender` is not
    ///   the address which is currently approved
    /// - If `expiration_ledger` is less than the current ledger number
    ///
    /// # Events
    ///
    /// Emits an event with:
    /// - topics - `["approve_all", owner: Address, spender: Address]`
    /// - data - `[token_id: u32, expiration_ledger: u32]`
    fn approve(env: Env, owner: Address, spender: Address, token_id: u32, expiration_ledger: u32);

    /// Enable or disable approval for a third party `spender` to manage all of
    /// `owner`'s NFTs.
    ///
    /// # Arguments
    ///
    /// - `owner` - The address currently holding the NFTs.
    /// - `spender` - The address being authorized to spend the NFT.
    /// - `expiration_ledger` - The ledger number where this approval expires.
    ///   Cannot be less than the current ledger number, unless it is 0. An
    ///   expired entry (where expiration_ledger < the current ledger number)
    ///   should be treated as unapproved. If 0 is passed, this function will
    ///   remove approval for this spender on behalf of this owner.
    ///
    /// # Panics
    ///
    /// - If `expiration_ledger` is 0 (removing approval), and `spender` is not
    ///   the approved on behalf of this owner
    /// - If `expiration_ledger` is less than the current ledger number
    ///
    /// # Events
    ///
    /// Emits an event with:
    /// - topics - `["approve_all", owner: Address]`
    /// - data - `[spender: Address, expiration_ledger: u32]`
    fn approve_all(env: Env, owner: Address, spender: Address, expiration_ledger: u32);

    /// Get the approved `spender` address for a single NFT.
    ///
    /// # Arguments
    ///
    /// - The NFT to find the approved address for.
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist
    fn get_approved(env: Env, token_id: u32) -> Option<Address>;

    /// Query if an address is an authorized spender for another address.
    ///
    /// # Arguments
    ///
    /// - `owner` - The address that owns the NFTs.
    /// - `spender` - The address that acts on behalf of the owner.
    fn is_approved_all(env: Env, owner: Address, spender: Address) -> bool;
}

pub trait NonFungibleTokenMetadata {
    /// A descriptive name for a collection of NFTs in this contract.
    fn name(env: Env) -> String;

    /// An abbreviated name for NFTs in this contract.
    fn symbol(env: Env) -> String;

    /// A distinct Uniform Resource Identifier (URI) for a given NFT.
    ///
    /// # Arguments
    ///
    /// - `token_id` - The NFT to get the URI for
    ///
    /// # Panics
    ///
    /// - If the NFT does not exist
    fn token_uri(env: Env, token_id: u32) -> String;
}

pub trait NonFungibleTokenEnumerable {
    /// Count NFTs tracked by this contract
    fn total_supply(env: Env) -> u32;

    /// Enumerate valid NFTs
    fn token_by_index(env: Env, index: u32) -> u32;

    /// Enumerate NFTs assigned to an owner
    fn token_of_owner_by_index(env: Env, owner: Address, index: u32) -> u32;
}
