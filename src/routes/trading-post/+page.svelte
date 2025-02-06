<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import trading_post from '$lib/contracts/trading_post';
    import { keyId } from '$lib/state/keyId';
    import { wallet } from '$lib/state/Wallet.svelte';
    import { account, kaleSacClient, sac, send } from '$lib/passkeyClient';

    import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
    import StatusDefListItem from '$lib/components/ui/StatusDefListItem.svelte';

    import type { PageData } from './$types';
    import { invalidate } from '$app/navigation';
    let { data }: { data: PageData } = $props();

    let isLoading = $state(false);
    let vegetableToTrade: string = $state(data.vegetables[0].contractAddress);
    let numTokens: number = $state(0);
    let buyKale: boolean = $state(false);
    let transferNumTokens: number = $state(0);
    let transferDestination: string = $state('');
    let transferVegetable: string = $state('KALE');

    function toggleBuyKale() {
        buyKale = !buyKale;
    }

    async function makeTrade() {
        try {
            isLoading = true;
            let at = await trading_post.trade({
                customer: wallet.address,
                vegetable: vegetableToTrade,
                amount: BigInt(numTokens * 10_000_000),
                buy_kale: buyKale,
            });

            let txn = await account.sign(at.built!, { keyId: $keyId });
            await send(txn.built!);

            toastStore.trigger({
                message: 'Successfully traded your produce. Enjoy!!',
                background: 'variant-filled-success',
            });

            wallet.getBalances(data.vegetables);
            invalidate('kf:trading-post:status');
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong trading your KALE. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isLoading = false;
        }
    }

    async function transferProduce() {
        try {
            isLoading = true;
            let sacClient =
                transferVegetable === 'KALE' ? kaleSacClient : sac.getSACClient(transferVegetable);

            let at = await sacClient.transfer({
                from: wallet.address,
                to: transferDestination,
                amount: BigInt(transferNumTokens * 10_000_000),
            });

            let txn = await account.sign(at.built!, { keyId: $keyId });
            await send(txn.built!);

            toastStore.trigger({
                message: 'Successfully transferred your produce. Congrats!!',
                background: 'variant-filled-success',
            });

            wallet.getBalances(data.vegetables);
        } catch (err) {
            console.log(err);
            toastStore.trigger({
                message: 'Something went wrong transferring your produce. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isLoading = false;
        }
    }
</script>

<h1 class="h1">Trading Post</h1>

<p>
    Exchange your hard-earned KALE tokens for other, related vegetables. Or trade them back to KALE.
    Always available at a 1:1 ratio, since they're all the same species of plant.
</p>

<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card bg-initial">
        <header class="card-header">
            <h2 class="h2 text-center">Trading Post Status</h2>
        </header>
        <section class="p-4 space-y-4">
            <dl class="list-dl">
                <StatusDefListItem
                    title="Trading Post Address"
                    value={trading_post.options.contractId}
                    isAddress
                />
                <StatusDefListItem title="Open for Business" value={data.instance.IsOpen} />
                <StatusDefListItem
                    title="KALE Asset Contract"
                    value={data.instance.KaleAddress}
                    isAddress
                />
                <StatusDefListItem
                    title="KALE Currently Deposited"
                    value={(Number(data.contractKale) / 10_000_000).toFixed(7)}
                />
                <StatusDefListItem
                    title="Current Shelf Space"
                    value={data.instance.MaxVegetables}
                />
                <StatusDefListItem title="Owner" value={data.instance.Owner} isAddress />
                <StatusDefListItem title="Vegetables Available" value={data.vegetables} />
            </dl>
        </section>
    </div>

    <div class="flex flex-col card bg-initial justify-between text-center">
        <header class="card-header">
            <h2 class="h2">Make a Trade</h2>
        </header>
        <section class="p-4 space-y-4">
            <label class="label">
                <span>You send</span>
                {@render amount(false)}
            </label>

            <div class="flex flex-row place-items-center">
                <div class="grow"><hr class="!border-t-2" /></div>
                <div class="px-2">
                    <button
                        class="btn-icon btn-icon-sm variant-filled-primary"
                        onclick={toggleBuyKale}><ArrowUpDown size={16} /></button
                    >
                </div>
                <div class="grow"><hr class="!border-t-2" /></div>
            </div>

            <label class="label">
                <span>You receive</span>
                {@render amount(true)}
            </label>
        </section>
        <footer class="card-footer">
            <button class="btn variant-filled-primary" onclick={makeTrade} disabled={isLoading}
                >Make Trade!</button
            >
        </footer>
    </div>
</div>

<div class="w-full grid grid-cols-1">
    <div class="card bg-initial text-center">
        <header class="card-header">
            <h3 class="h3">Transfer Produce</h3>
        </header>
        <section class="p-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                    <input type="number" placeholder="Amount" bind:value={transferNumTokens} />
                    <select bind:value={transferVegetable}>
                        <option>KALE</option>
                        {#each data.vegetables as vegetable}
                            <option value={vegetable.contractAddress}>{vegetable.assetCode}</option>
                        {/each}
                    </select>
                </div>
                <input
                    class="input"
                    type="text"
                    placeholder="Destination"
                    bind:value={transferDestination}
                />
            </div>
        </section>
        <footer class="card-footer">
            <button
                class="btn variant-filled-primary"
                onclick={transferProduce}
                disabled={isLoading}>Send that produce!</button
            >
        </footer>
    </div>
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
