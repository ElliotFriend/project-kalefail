use soroban_sdk::contracttype;

#[contracttype]
#[derive(Clone)]
pub enum Storage {
    Owner,         // : address
    KaleAddress,   // : address
    Vegetables,    // : vec<address>
    MaxVegetables, // : u32
    IsOpen,        // : bool
}
