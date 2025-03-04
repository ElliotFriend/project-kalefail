#![cfg(test)]

use crate::types::{Metadata, ApprovedData};
use crate::{KaleSaladContract, Storage};
use soroban_sdk::{token, vec, Address, Env, String, Vec, testutils::{Ledger, LedgerInfo}};
use test_fixture::TestFixture;

const TEN_TOKENS: i128 = 10 * 10_000_000;
const NFT_NAME: &str = "KALE Salad";
const NFT_SYMBOL: &str = "KS";
const IPFS_URI: &str = "ipfs://bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/";
const TOKEN_4_URI: &str =
    "ipfs://bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/4";

// bring in our test fixtures
mod test_fixture;

// test the main ERC 721 functions
mod approve;
mod approve_all;
mod burn;
mod burn_from;
mod transfer;
mod transfer_from;
// test the ERC 721 enumerable interface
mod enumerable;
// test the ERC 721 metadata interface
mod metadata;

// test my own functionality
mod constructor;
mod mint;
