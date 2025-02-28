#![cfg(test)]

use crate::types::Metadata;
use crate::{KaleSaladContract, Storage};
use soroban_sdk::{token, vec, Address, Env, String, Vec};
use test_fixture::TestFixture;

const NFT_NAME: &str = "KALE Salad";
const NFT_SYMBOL: &str = "KS";
const IPFS_URI: &str = "ipfs://bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/";
// const TOKEN_192_URI: &str =
//     "ipfs://bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/192";

mod constructor;
mod enumerable;
mod mint;
mod metadata;
mod test_fixture;
