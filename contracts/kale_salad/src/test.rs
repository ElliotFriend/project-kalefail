#![cfg(test)]

use crate::types::{ApprovedData, Metadata, Storage};
use crate::KaleSaladContract;
// use crate::storage::Storage;
use soroban_sdk::{
    testutils::{Ledger, LedgerInfo},
    token, vec, Address, Env, String, Vec,
};
use test_fixture::TestFixture;

const NFT_NAME: &str = "KALE Salad";
const NFT_SYMBOL: &str = "KSLD";
const IPFS_URI: &str = "ipfs://bafybeifmrpa7cpep7j6thdgs4dsteev7lvfwwvxuywofarnghdwevizdsa/";
const TOKEN_4_URI: &str = "ipfs://bafybeifmrpa7cpep7j6thdgs4dsteev7lvfwwvxuywofarnghdwevizdsa/4";

// bring in our test fixtures
mod test_fixture;

// test the main ERC 721 functions
mod approve;
mod approve_all;
mod burn;
mod burn_from;
mod metadata;
mod transfer;
mod transfer_from;

// test my own functionality
mod constructor;
mod mint;
