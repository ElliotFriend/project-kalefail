extern crate std;

use soroban_sdk::{testutils::Address as _, token::StellarAssetClient};

use super::*;
use crate::KaleSaladContractClient;

fn create_stellar_token<'a>(
    env: &Env,
    admin: &Address,
) -> (Address, StellarAssetClient<'a>, token::Client<'a>) {
    let contract_address = env
        .register_stellar_asset_contract_v2(admin.clone())
        .address();
    let sac_client = StellarAssetClient::new(&env, &contract_address);
    sac_client.set_admin(admin);
    let sep_client = token::Client::new(&env, &contract_address);

    return (contract_address, sac_client, sep_client);
}

pub struct TestFixture<'a> {
    pub env: Env,
    pub issuer: Address,
    pub owners: Vec<Address>,
    pub vegetables: [(StellarAssetClient<'a>, token::Client<'a>); 4],
    pub kale_salad_client: KaleSaladContractClient<'a>,
}

impl TestFixture<'_> {
    pub fn create<'a>() -> TestFixture<'a> {
        let env = Env::default();
        env.mock_all_auths();

        let issuer = Address::generate(&env);
        let nft_owner_1 = Address::generate(&env);
        let nft_owner_2 = Address::generate(&env);
        let nft_owner_3 = Address::generate(&env);
        let nft_owner_4 = Address::generate(&env);
        let owners = vec![&env, nft_owner_1, nft_owner_2, nft_owner_3, nft_owner_4];

        let (broc_id, broc_sac, broc_sep) = create_stellar_token(&env, &issuer);
        let (cabb_id, cabb_sac, cabb_sep) = create_stellar_token(&env, &issuer);
        let (kohl_id, kohl_sac, kohl_sep) = create_stellar_token(&env, &issuer);
        let (brsp_id, brsp_sac, brsp_sep) = create_stellar_token(&env, &issuer);


        owners.iter().for_each(|owner| {
            broc_sac.mint(&owner, &(1000 * 10_000_000));
            cabb_sac.mint(&owner, &(1000 * 10_000_000));
            kohl_sac.mint(&owner, &(1000 * 10_000_000));
            brsp_sac.mint(&owner, &(1000 * 10_000_000));
        });

        let vegetables = [
            (broc_sac, broc_sep),
            (cabb_sac, cabb_sep),
            (kohl_sac, kohl_sep),
            (brsp_sac, brsp_sep),
        ];

        let kale_address = env.register(
            KaleSaladContract,
            (
                issuer.clone(),
                String::from_str(&env, NFT_NAME),
                String::from_str(&env, NFT_SYMBOL),
                String::from_str(&env, IPFS_URI),
                vec![&env, broc_id, cabb_id, kohl_id, brsp_id],
                (10 * 10_000_000) as i128,
            ),
        );
        let kale_client = KaleSaladContractClient::new(&env, &kale_address);

        return TestFixture {
            env,
            issuer,
            owners,
            vegetables,
            kale_salad_client: kale_client,
        };
    }
}
