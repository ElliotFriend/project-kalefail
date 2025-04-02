<script lang="ts">
    import { wallet } from '$lib/state/Wallet.svelte';
    import { page } from '$app/state';
    import RefreshCw from 'lucide-svelte/icons/refresh-cw';

    import BalanceBadge from '$lib/components/BalanceBadge.svelte';

    import { slide } from 'svelte/transition';
    let numBalances = $derived(page.data.vegetables.length + 1);
</script>

{#if wallet.address}
    <div transition:slide class="flex bg-secondary-100-800-token p-2 gap-2 justify-center">
        <div class="flex gap-2 items-center">
            {#await wallet.getBalances(page.data.vegetables)}
                {#each { length: numBalances }}
                    <div class="placeholder w-36"></div>
                {/each}
            {:then}
                {#each Object.entries(wallet.balances) as [asset, balance] (asset)}
                    <BalanceBadge {asset} {balance} />
                {/each}
            {/await}
            <RefreshCw
                style="cursor: pointer;"
                size={12}
                onclick={() => wallet.getBalances(page.data.vegetables)}
            />
        </div>
    </div>
{/if}
