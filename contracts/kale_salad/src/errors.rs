use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Errors {
    UnsetMetadata = 1,
    TooManyTokens = 2,
    InsufficientPayment = 3,
    TooFewVegetables = 4,
    InvalidSpender = 5,
    CannotApproveOwner = 6,
    NonExistentToken = 300,
    IncorrectOwner = 301,
    InvalidOperator = 302,
    InsufficientApproval = 304,
    InvalidApprover = 306,
    InvalidApprovalExpiration = 307,
}
