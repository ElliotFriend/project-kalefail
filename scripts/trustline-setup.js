import 'dotenv/config';
import {
    Asset,
    Keypair,
    TransactionBuilder,
    Operation,
    BASE_FEE,
    rpc,
    TimeoutInfinite,
} from '@stellar/stellar-sdk';

const server = new rpc.Server(process.env.PUBLIC_STELLAR_RPC_URL);

const submitTx = async (tx) => {
    let { hash } = await server.sendTransaction(tx);
    let { status } = await server.pollTransaction(hash);

    console.log(status, hash);
};

const issuerKp = Keypair.fromSecret(process.env.TEST_ISSUER_SECRET);
const distKp = Keypair.fromSecret(process.env.TEST_DIST_SECRET);

const VEGETABLES = [
    new Asset('BROCCOLI', issuerKp.publicKey()),
    new Asset('CABBAGE', issuerKp.publicKey()),
    new Asset('KOHLRABI', issuerKp.publicKey()),
];

const distSource = await server.getAccount(distKp.publicKey());

// build a transaction that creates trustlines for each vegetable asset
let trustlineTx = new TransactionBuilder(distSource, {
    fee: BASE_FEE,
    networkPassphrase: process.env.PUBLIC_STELLAR_NETWORK_PASSPHRASE,
});

VEGETABLES.forEach((v) => {
    trustlineTx.addOperation(
        Operation.changeTrust({
            asset: v,
        }),
    );
});

let newTx = trustlineTx.setTimeout(TimeoutInfinite).build();
newTx.sign(distKp);

await submitTx(newTx);

// build/submit a series of transactions to set the SAC admin on each asset contract
VEGETABLES.forEach(async (v) => {
    let tx = new TransactionBuilder(distSource, {
        fee: BASE_FEE,
        networkPassphrase: process.env.PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    })
        .addOperation(
            Operation.createStellarAssetContract({
                asset: v,
            }),
        )
        .setTimeout(TimeoutInfinite)
        .build();

    tx = await server.prepareTransaction(tx);
    tx.sign(distKp);

    await submitTx(tx);
});
