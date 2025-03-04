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

pub fn create_owners_vec<'a>(env: &Env, num_owners: &u8) -> Vec<Address> {
    let mut owners_vec = vec![env];
    for _ in 0..*num_owners {
        owners_vec.push_back(Address::generate(env));
    }

    return owners_vec;
}

pub fn mint_vegetables_to_owners<'a>(
    owners: &Vec<Address>,
    vegetables: [&StellarAssetClient<'a>; 4],
) {
    owners.iter().for_each(|owner| {
        vegetables.iter().for_each(|vegetable| {
            vegetable.mint(&owner, &(1000 * 10_000_000));
        })
    })
}

pub struct TestFixture<'a> {
    pub env: Env,
    pub admin: Address,
    pub owners: Vec<Address>,
    pub vegetables: [(StellarAssetClient<'a>, token::Client<'a>); 4],
    pub kale_salad_client: KaleSaladContractClient<'a>,
}

impl TestFixture<'_> {
    pub fn create<'a>() -> TestFixture<'a> {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let owners = create_owners_vec(&env, &4);

        let (broc_id, broc_sac, broc_sep) = create_stellar_token(&env, &admin);
        let (cabb_id, cabb_sac, cabb_sep) = create_stellar_token(&env, &admin);
        let (kohl_id, kohl_sac, kohl_sep) = create_stellar_token(&env, &admin);
        let (brsp_id, brsp_sac, brsp_sep) = create_stellar_token(&env, &admin);

        // owners.iter().for_each(|owner| {
        //     broc_sac.mint(&owner, &(1000 * 10_000_000));
        //     cabb_sac.mint(&owner, &(1000 * 10_000_000));
        //     kohl_sac.mint(&owner, &(1000 * 10_000_000));
        //     brsp_sac.mint(&owner, &(1000 * 10_000_000));
        // });
        mint_vegetables_to_owners(&owners, [&broc_sac, &cabb_sac, &kohl_sac, &brsp_sac]);

        let vegetables = [
            (broc_sac, broc_sep),
            (cabb_sac, cabb_sep),
            (kohl_sac, kohl_sep),
            (brsp_sac, brsp_sep),
        ];
        // mint_vegetables_to_owners(&owners, vegetables);

        let kale_address = env.register(
            KaleSaladContract,
            (
                admin.clone(),
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
            admin,
            owners,
            vegetables,
            kale_salad_client: kale_client,
        };
    }
}
