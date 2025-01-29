<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import TruncatedAddress from '$lib/components/ui/TruncatedAddress.svelte';
    import trading_post from '$lib/contracts/trading_post';
    import { walletAddress } from '$lib/stores/walletAddress';
    import { account, send } from '$lib/passkeyClient';

    import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down'

    import type { PageData } from './$types';
    import { keyId } from '$lib/stores/keyId';
    let { data }: { data: PageData } = $props();

    let isLoading = $state(false);
    let vegetableToTrade: string = $state(data.vegetables[0].contractAddress);
    let numTokens: number = $state(0)
    let buyKale: boolean = $state(false);

    function toggleBuyKale() {
        buyKale = !buyKale
    }

    async function makeTrade() {
        try {
            isLoading = true;
            let at = await trading_post.trade({
                customer: $walletAddress,
                vegetable: vegetableToTrade,
                amount: BigInt(numTokens * 10_000_000),
                buy_kale: buyKale,
            })

            // console.log('at', at)
            let txn = await account.sign(at.built!, { keyId: $keyId })
            console.log('signed at', txn.built?.toXDR())

            let result = await send(txn.built!);
            console.log('result', result)
        } catch (err) {
            console.log(err)
            toastStore.trigger({
                message: 'Something went wrong trading your KALE. Please try again later.',
                background: 'variant-filled-error',
            })
        } finally {
            isLoading = false
        }
    }
</script>

<h1 class="h1">Trading Post</h1>

<p>Exchange your hard-earned KALE tokens for other, related vegetables. Always available at a 1:1 ratio, since they're all the same species of plant.</p>

<h2 class="h2">Status</h2>

<p><strong>Trading Post Address:</strong> <TruncatedAddress address={trading_post.options.contractId} startChars={10} /></p>

<p><strong>Trading Post Status:</strong> {data.instance.IsOpen ? 'Open' : 'Closed'}</p>

<p><strong>KALE stored in trading post:</strong> {Number(data.balances['KALE']) / 10_000_000}</p>

<p><strong>Vegetables available for trading:</strong></p>

<ul class="list">
    {#each data.vegetables as vegetable}
        <li>
            <span>(icon)</span>
            <span class="flex-auto"><code class="code">{vegetable.assetCode}</code></span>
        </li>
    {/each}
</ul>

<h2 class="h2">Make a Trade</h2>

<div class="card p-4 space-y-4">
    <label class="label">
        <span>You send</span>
        {@render amount(false)}
    </label>

    <div class="flex flex-row place-items-center">
        <div class="grow"><hr class="!border-t-2" /></div>
        <div class="px-2">
            <button class="btn-icon btn-icon-sm variant-filled-primary" onclick={toggleBuyKale}><ArrowUpDown size={16} /></button>
        </div>
        <div class="grow"><hr class="!border-t-2" /></div>
    </div>

    <label class="label">
        <span>You receive</span>
        {@render amount(true)}
    </label>

    <button class="btn variant-filled-primary" onclick={makeTrade} disabled={isLoading}>Make Trade!</button>
</div>

{#snippet amount(isReceive: boolean)}
    <div class="input-group input-group-divider grid-cols-[1fr_auto]">
        <input type="number" placeholder="Amount" bind:value={numTokens} disabled={isReceive} />
        {#if (isReceive && buyKale) || (!isReceive && !buyKale)}
            <select disabled>
                <option>KALE</option>
            </select>
        {:else}
            <select bind:value={vegetableToTrade}>
                {#each data.vegetables as vegetable}
                    <option value={vegetable.contractAddress}>{vegetable.assetCode}</option>
                {/each}
            </select>
        {/if}
    </div>
{/snippet}
