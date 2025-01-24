use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Errors {
    InvalidVegetable = 1,         // The selected token is not a tradeable vegetable.
    TradingPostClosed = 2,        // The trading post is currently not processing trades.
    VegetablesRequired = 3, // The trading post cannot be set to open if no vegetables are available.
    ContractNotSacAdmin = 4, // The trading post contract is not set as the SAC admin for a vegetable asset.
    VegetableNotForTrade = 5, // The vegetable to remove is not available for trade.
    VegetableAlreadyForTrade = 6, // The vegetable cannot be removed, it is already available for trade.
    TradingPostOpen = 7,          // The contract cannot be upgraded while the trading post is open.
    TooManyVegetables = 8,        // The number of vegetables available exceeds the maximum.
    ShelfAlreadyBigger = 9, // The maximum vegetables is already greater than provided expansion.
    ShelfAlreadySmaller = 10, // The maximum vegetables is already smaller than the provided size.
    NotEnoughKale = 11,     // The trading post does not have enough KALE to make the trade.
}
