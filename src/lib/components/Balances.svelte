<script lang="ts">
    import { walletAddress } from '$lib/stores/walletAddress';
    import { sac, kaleSacClient } from '$lib/passkeyClient';
    import type { VegetableAsset } from '$lib/types';
    import RefreshCw from 'lucide-svelte/icons/refresh-cw'

    import { page } from '$app/state';
    // console.log('page', page.data)

    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    const popupBalances: PopupSettings = {
        event: 'click',
        target: 'popupBalances',
        placement: 'bottom',
        closeQuery: 'will-close',
    }

    // let vegetableBalances: Record<string, Promise<number>> = $derived.by(() => {
    //     const returnObj: Record<string, Promise<number>> = {};
    //     if ($walletAddress) {
    //         returnObj['KALE'] = kaleSacClient.balance({ id: $walletAddress })
    //             .then(({result}) =>  Number(result) / 10_000_000);

    //             page.data.vegetables.forEach((vegetable: VegetableAsset) => {
    //                 let sacClient = sac.getSACClient(vegetable.contractAddress);
    //                 returnObj[vegetable.assetCode] = sacClient.balance({ id: $walletAddress })
    //                     .then(({result}) => Number(result) / 10_000_000);
    //             });

    //         console.log(returnObj)
    //     }
    //     return returnObj
    // });

    async function getBalances(): Promise<Record<string, number>> {
        let returnObj: Record<string, number> = {};
        let { result } = await kaleSacClient.balance({ id: $walletAddress })
        returnObj['KALE'] = Number(result) / 10_000_000;

        await Promise.all(page.data.vegetables.map(async (vegetable: VegetableAsset) => {
            let sacClient = sac.getSACClient(vegetable.contractAddress);
            let { result } = await sacClient.balance({ id: $walletAddress })
            returnObj[vegetable.assetCode] = Number(result) / 10_000_000 || 0;
            // console.log('returnObj', returnObj[vegetable.assetCode])
        }));

        return returnObj
    }
</script>

{#if $walletAddress}
    <!-- <button class="btn btn-sm variant-filled" use:popup={popupBalances}>Show Balances</button>

    <div class="card p-4 shadow-xl z-10" data-popup="popupBalances">
        <div class="grid grid-cols gap-2"> -->
    <div class="flex gap-1">
        {#await getBalances() then vegetableBalances}
            <!-- {@debug vegetableBalances} -->
            {#each Object.entries(vegetableBalances) as [vAsset, vBalance]}
                {@const className=`badge variant-filled-${vAsset === 'KALE' ? 'success' : 'secondary'}`}
                <span class={className}>{vBalance === 0 ? vBalance : vBalance.toFixed(7)} {vAsset}</span>
            {/each}
        {/await}
        <!-- <button type="button" class="btn-icon btn-icon-sm" onclick={getBalances}><RefreshCw size={12} /></button> -->
    </div>
            <!-- <button class="btn btn-sm variant-filled" onclick={() => getBalances()}>Refresh balances</button>
        </div>
        <div class="arrow bg-surface-100-800-token"></div>
    </div> -->
{/if}
