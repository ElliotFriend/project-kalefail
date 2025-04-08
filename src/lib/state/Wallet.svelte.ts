import { kaleSacClient, rpc, sac } from '$lib/passkeyClient';
import { Contract } from '@stellar/stellar-sdk';
import type { VegetableAsset } from '$lib/types';
import { PUBLIC_WALLET_WASM_HASH } from '$env/static/public';

export class Wallet {
    address: string = $state('');
    balances: Record<string, number> = $state({});
    wasmHash: string = $state('');
    upgradeAvailable: boolean = $state(false);

    getBalances = async (vegetables: VegetableAsset[]) => {
        if (this.address) {
            console.log('Wallet.svelte.ts is getting balances');
            const { result } = await kaleSacClient.balance({ id: this.address });
            this.balances['KALE'] = Number(result) / 10_000_000;

            await Promise.all(
                vegetables.map(async (vegetable: VegetableAsset) => {
                    const sacClient = sac.getSACClient(vegetable.contractAddress);
                    const { result } = await sacClient.balance({ id: this.address });
                    this.balances[vegetable.assetCode] = Number(result) / 10_000_000 || 0;
                }),
            );
        }
    };

    getWasmHash = async () => {
        if (this.address) {
            console.log('Wallet.svelte.ts is checking upgradeability');
            const contract = new Contract(this.address);
            const { entries } = await rpc.getLedgerEntries(contract.getFootprint());
            const wasmHash = entries[0].val
                .contractData()
                .val()
                .instance()
                .executable()
                .wasmHash()
                .toString('hex');

            this.wasmHash = wasmHash;

            if (wasmHash !== PUBLIC_WALLET_WASM_HASH) {
                this.upgradeAvailable = true;
            } else {
                this.upgradeAvailable = false;
            }
        }
    };

    reset = () => {
        this.address = '';
        this.balances = {};
        this.upgradeAvailable = false;
    };
}

export const wallet = new Wallet();
