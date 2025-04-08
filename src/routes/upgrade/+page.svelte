<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
    import { fade } from 'svelte/transition';
    import { Client } from '@stellar/stellar-sdk/contract';

    import {
        PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        PUBLIC_STELLAR_RPC_URL,
        PUBLIC_WALLET_WASM_HASH,
    } from '$env/static/public';
    import { wallet } from '$lib/state/Wallet.svelte';
    import { keyId } from '$lib/state/keyId';
    import { account, send } from '$lib/passkeyClient';

    import PageHeader from '$lib/components/ui/PageHeader.svelte';
    import StatusDefListItem from '$lib/components/ui/StatusDefListItem.svelte';

    let newWasmHash = $state(PUBLIC_WALLET_WASM_HASH);
    let customWasmHash = $derived(newWasmHash !== PUBLIC_WALLET_WASM_HASH);
    let alreadyUpgraded = $derived(newWasmHash === wallet.wasmHash);
    let isLoading = $state(false);

    async function getWasmFunctions(wasmHash: string): Promise<string[] | undefined> {
        if (Buffer.from(wasmHash, 'hex').length !== 32) {
            console.error('invalid Wasm hash length');
            return;
        } else {
            // @ts-expect-error: client options wants a contract ID, but by
            // nature of using the wasmHash, we _don't_ have a contract ID.
            let contractClient = await Client.fromWasmHash(wasmHash, {
                rpcUrl: PUBLIC_STELLAR_RPC_URL,
                networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            });
            return contractClient.spec.funcs().map((f) => f.name().toString());
        }
    }

    async function upgradeWallet() {
        console.log(`upgrading wallet with Wasm hash: ${newWasmHash}`);
        try {
            isLoading = true;
            let at = await account.wallet?.update_contract_code({
                hash: Buffer.from(newWasmHash, 'hex'),
            });

            if (!at) {
                throw 'missing assembled transaction';
            }

            let txn = await account.sign(at.built!, { keyId: $keyId });
            await send(txn.built!);
            wallet.getWasmHash();

            toastStore.trigger({
                message: 'Successfully upgraded your smart wallet. Way to go!!',
                background: 'variant-filled-success',
            });
        } catch (err: unknown) {
            console.error(err);

            toastStore.trigger({
                message:
                    'Something went wrong upgrading your smart wallet. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isLoading = false;
        }
    }
</script>

<PageHeader
    title="The Upgrade"
    subtitle="Keep your smart wallet fresh and secure by upgrading to the latest and greatest executable code available."
/>

<p>
    One of the key benefits of the smart wallet's we're using is that it is <em>upgradeable</em>!
    That means you can upgrade the contract whenever a new one comes along that will suit your needs
    better. Super convenient. And, yet another way we're keeping <em>YOU</em> in control of your own
    wallet.
</p>

<p>
    Use this page to upgrade your smart wallet to <em>ANY</em> deployed contract code on the network.
    We've pre-populated the Wasm hash below with the current contract code we're deploying for new accounts.
    But, you could use any deployed contract you'd like.
</p>

<div class="w-full grid grid-cols-1">
    <div class="card">
        <header class="card-header">
            <h3 class="h3">Upgrade Your Smart Wallet</h3>
        </header>
        <section class="p-4 space-y-4">
            <article class="space-y-4">
                <p>
                    Paste a Wash hash in the box below to preview (above) what smart contract
                    functions are available in the provided executable.
                </p>
                <p>When you're ready, click the <strong>Upgrade Now</strong> button to proceed.</p>
            </article>
            <label class="label">
                <span>New Wasm Hash</span>
                <div class="input-group input-group-divider grid-cols-[1fr_auto]">
                    <input type="text" placeholder="New Wasm Hash" bind:value={newWasmHash} />
                    <button
                        class={[
                            customWasmHash ? 'variant-filled-secondary' : 'variant-soft-secondary',
                        ]}
                        onclick={() => (newWasmHash = PUBLIC_WALLET_WASM_HASH)}
                        disabled={!customWasmHash}>Use Recommended</button
                    >
                </div>
            </label>

            <div class="text-center">
                <button
                    class="btn variant-filled"
                    disabled={isLoading || alreadyUpgraded}
                    onclick={upgradeWallet}>Upgrade Now</button
                >
            </div>
        </section>
    </div>
</div>

{#if customWasmHash}
    <aside transition:fade class="alert variant-filled-warning">
        <div><TriangleAlert size={48} /></div>
        <div class="alert-message">
            <h4 class="h4" data-toc-ignore>Heads up!</h4>
            <p>You should be absolutely sure you trust the Wasm hash before upgrading.</p>
            <p>
                If you put in some Wasm hash that doesn't implement smart wallet functionality, or
                isn't upgradeable itself, it's possible you'll bork your smart wallet beyond repair.
            </p>
        </div>
    </aside>
{/if}

<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card">
        <header class="card-header">
            <h3 class="h3" data-toc-ignore>Current Wallet</h3>
        </header>

        <section class="p-4 space-y-4 overflow-hidden">
            <article>
                <p>This is the executable code that your wallet is <em>currently</em> running.</p>
            </article>
            {#if wallet.wasmHash}
                {#await getWasmFunctions(wallet.wasmHash) then wasmFuncs}
                    <dl class="list-dl">
                        <StatusDefListItem title="Wasm Hash" value={wallet.wasmHash} isHex />
                        <StatusDefListItem title="Available Functions" value={wasmFuncs || []} />
                    </dl>
                {/await}
            {:else}
                <p>Please login first.</p>
            {/if}
        </section>
    </div>

    <div class="card">
        <header class="card-header">
            <h3 class="h3" data-toc-ignore>New Wallet</h3>
        </header>

        <section class="p-4 space-y-4 overflow-hidden">
            <article>
                <p>
                    This is the executable code that you're <em>considering</em> to run your smart wallet.
                </p>
            </article>
            {#await getWasmFunctions(newWasmHash) then wasmFuncs}
                {#if wasmFuncs}
                    <dl class="list-dl">
                        <StatusDefListItem title="Wasm Hash" value={newWasmHash} isHex />
                        <StatusDefListItem title="Available Functions" value={wasmFuncs || []} />
                    </dl>
                {:else}
                    <p>No functions for provided Wasm hash. Please try another.</p>
                {/if}
            {/await}
        </section>
    </div>
</div>
