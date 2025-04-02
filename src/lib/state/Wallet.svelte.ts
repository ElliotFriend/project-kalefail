import { kaleSacClient, sac } from '$lib/passkeyClient';
import type { VegetableAsset } from '$lib/types';

export class Wallet {
    address: string = $state('');
    balances: Record<string, number> = $state({});

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

    reset = () => {
        this.address = '';
        this.balances = {};
    };
}

export const wallet = new Wallet();
