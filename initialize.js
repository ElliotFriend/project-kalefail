import 'dotenv/config';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { sync as glob } from 'glob';
import { Asset } from '@stellar/stellar-sdk';

// Load environment variables starting with `PUBLIC_` into the environment, so
// we don't need to specify duplicate variables in .env
for (const key in process.env) {
    if (key.startsWith('PUBLIC_')) {
        process.env[key.substring(7)] = process.env[key];
    }
}

console.log('###################### Initializing ########################');

// Get the absolute path to the project directory (i.e. where this
// `initialize.js` script is located)
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const KALE = new Asset('KALE', process.env.KALE_ISSUER);
const kaleSacAddress = KALE.contractId(process.env.STELLAR_NETWORK_PASSPHRASE);

const VEGETABLES = [
    new Asset('BROCCOLI', process.env.FAIL_ISSUER),
    new Asset('CABBAGE', process.env.FAIL_ISSUER),
    new Asset('KOHLRABI', process.env.FAIL_ISSUER),
    new Asset('BRSPROUTS', process.env.FAIL_ISSUER),
];

/**
 * This function logs and then executes a shell command.
 * @param {string} command shell command to run
 */
function exe(command) {
    // log the command which will run to standard out
    console.log(command);
    // execute the command, waiting for it to return before moving on
    execSync(command, { stdio: 'inherit' });
}

/**
 * Generates a new keypair, and funds it if we're not using Mainnet.
 */
function fundAll() {
    exe(`stellar keys generate ${process.env.STELLAR_ACCOUNT} | true`);
    if (
        process.env.STELLAR_NETWORK_PASSPHRASE !== 'Public Global Stellar Network ; September 2015'
    ) {
        exe(
            `stellar keys fund ${process.env.STELLAR_ACCOUNT} --network ${process.env.STELLAR_NETWORK}`,
        );
    }
}

/**
 * Removes files matching a glob pattern. Used for cleaning old contract builds.
 * @param {string} pattern pattern to match with the rm command
 */
function removeFiles(pattern) {
    console.log(`remove ${pattern}`);
    glob(pattern).forEach((entry) => rmSync(entry));
}

/**
 * Removes old contract builds, and re-builds smart contracts.
 */
function buildAll() {
    removeFiles(`${dirname}/target/wasm32-unknown-unknown/release/*.wasm`);
    removeFiles(`${dirname}/target/wasm32-unknown-unknown/release/*.d`);
    exe(`stellar contract build`);
}

/**
 * Takes a file name or path, and returns only the filename portion. For
 * example, the filename `/something/cool.txt` will return `cool`.
 * @param {string} filename full file name or path to extract the name from
 * @returns {string} the name of the file, with no extension or leading path
 */
function filenameNoExtension(filename) {
    return path.basename(filename, path.extname(filename));
}

/**
 * Deploy a contract's Wasm file to the network
 * @param {string} wasm path to the compiled Wasm file
 */
function deploy(wasm) {
    const alias = filenameNoExtension(wasm);
    if (alias !== 'kitchen') {
        let constructor_args;
        switch (alias) {
            case 'trading_post':
                constructor_args = `-- --owner ${process.env.STELLAR_ACCOUNT} --kale ${kaleSacAddress} --vegetables '${JSON.stringify(VEGETABLES.map((v) => v.contractId(process.env.STELLAR_NETWORK_PASSPHRASE)))}'`;
                break;
            case 'kale_salad':
                constructor_args = `-- --admin ${process.env.STELLAR_ACCOUNT} --nft_name "KALE Salad" --nft_symbol "KSLD" --base_uri "ipfs://bafybeifmrpa7cpep7j6thdgs4dsteev7lvfwwvxuywofarnghdwevizdsa/" --vegetables '${JSON.stringify(VEGETABLES.map((v) => v.contractId(process.env.STELLAR_NETWORK_PASSPHRASE)))}' --payment_each_vegetable 0`;
                break;
            case 'kale_tractor':
                constructor_args = `-- --farm ${kaleSacAddress}`; // this isn't right but meh
                break;
            default:
                constructor_args = '';
        }
        exe(
            `stellar contract deploy --wasm ${wasm} --ignore-checks --alias ${alias} ${constructor_args}`,
        );
    }
}

/**
 * Iterate through all compiled Wasm files in the project, and deploy them to
 * the network.
 */
function deployAll() {
    // make sure a directory is ready to store our deployed contract information
    const contractsDir = `${dirname}/.stellar/contract-ids`;
    mkdirSync(contractsDir, { recursive: true });

    // search for all compiled Wasm files
    const wasmFiles = glob(`${dirname}/target/wasm32-unknown-unknown/release/*.wasm`);

    // run the `deploy()` function for each compiled Wasm file found
    wasmFiles.forEach(deploy);
}

/**
 * Iterate through all deployed contracts, creating an array of objects with
 * each contract's `alias` (its filename) and `address` (deployed on the
 * network).
 * @returns {{ alias: string, address: string }[]} array of objects with aliases and addresses
 */
function contracts() {
    // search for all deployed contracts
    const contractFiles = glob(`${dirname}/.stellar/contract-ids/*.json`);

    return (
        contractFiles
            // start by mapping the found files, adding an alias to the object
            .map((path) => ({
                alias: filenameNoExtension(path),
                ...JSON.parse(readFileSync(path)),
            }))
            // only grab contracts for the network we want
            .filter((data) => data.ids[process.env.STELLAR_NETWORK_PASSPHRASE])
            // add the contract address to the return object
            .map((data) => ({
                alias: data.alias,
                id: data.ids[process.env.STELLAR_NETWORK_PASSPHRASE],
            }))
    );
}

/**
 * Generate a contract bindings package for the specified contract address,
 * outputs to a directory based on the alias.
 * @param {{alias: string, id: string}} contract the contract to generate bindings for
 */
function bind({ alias, id }) {
    exe(
        `stellar contract bindings typescript --id ${id} --output-dir ${dirname}/packages/${alias} --overwrite`,
    );

    exe(`cd packages/${alias} && pnpm install && pnpm run build && cd ../..`);
}

/**
 * Iterate through all deployed contracts and run the `bind()` function for
 * each one.
 */
function bindAll() {
    contracts().forEach(bind);
}

/**
 * Create a library file importing the bindings package(s) for use in frontend
 * code.
 * @param {{ alias: string }} contract the contract address to create a library for
 */
function importContract({ alias }) {
    // make sure a directory is ready to store our deployed library file
    const outputDir = `${dirname}/src/lib/contracts/`;
    mkdirSync(outputDir, { recursive: true });

    // the required imports/exports for the library
    const importContent =
        `import * as Client from '${alias}';\n` +
        `import { PUBLIC_STELLAR_RPC_URL, PUBLIC_STELLAR_NETWORK } from '$env/static/public';\n\n` +
        `export default new Client.Client({\n` +
        `    //@ts-ignore\n` +
        `    ...Client.networks.${process.env}[PUBLIC_STELLAR_NETWORK],\n` +
        `    rpcUrl: PUBLIC_STELLAR_RPC_URL,\n` +
        `});\n`;

    // output the file contents to the specified file
    const outputPath = `${outputDir}/${alias}.ts`;
    writeFileSync(outputPath, importContent);

    // log a message to the console
    console.log(`Created import for ${alias}`);
}

/**
 * Iterate through all deployed contracts and run the `importContract()`
 * function for each one.
 */
function importAll() {
    contracts().forEach(importContract);
}

function sacDeploy(veg) {
    exe(`stellar contract asset deploy --asset ${veg.code}:${veg.issuer} | true`);
}

function sacDeployAll() {
    VEGETABLES.forEach(sacDeploy);
}

function sacAdmin() {
    contracts().forEach(({ alias, id }) => {
        if (alias === 'trading_post') {
            VEGETABLES.forEach((v) => {
                const sac = v.contractId(process.env.STELLAR_NETWORK_PASSPHRASE);
                exe(`stellar contract invoke --id ${sac} -- set_admin --new_admin ${id}`);
            });
        }
    });
}

function openTradingPost() {
    contracts().forEach(({ alias, id }) => {
        if (alias === 'trading_post') {
            exe(`stellar contract invoke --id ${id} -- open`);
        }
    });
}

/* Now, we call the functions we've written in the order we want them to happen: */
// 1. generate and (optionally) fund an account
fundAll();
// 2. compile and build contracts
buildAll();
// 3. deploy all SAC contracts for the vegetables at the trading post
sacDeployAll();
// 4. deploy all built contracts
deployAll();
// 5. set the SAC admin to the deployed contract
sacAdmin();
// 6. open the trading post contract
openTradingPost();
// 7. generate bindings for all deployed contracts
bindAll();
// 8. create a library file importing each bindings package into the frontend
importAll();
