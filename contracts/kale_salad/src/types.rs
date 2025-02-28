use soroban_sdk::{contracttype, Address, String};

#[contracttype]
pub struct Metadata {
    pub name: String,
    pub symbol: String,
    pub base_uri: String,
}

#[contracttype]
pub struct ApprovedData {
    pub spender: Address,
    pub expiration_ledger: u32,
}

#[contracttype]
#[derive(Clone)]
pub enum Storage {
    Issuer,               // : address
    Metadata,             // : Metadata
    Vegetables,           // : vec<address>
    PaymentPerToken,      // : i128
    Supply,               // : u32
    MintIndex,            // : u32
    Balance(Address),     // : vec<u32>
    Owner(u32),           // : address
    Approved(u32),        // : ApprovedData
    ApprovedAll(Address), // : ApprovedData
}
