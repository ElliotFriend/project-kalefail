<script lang="ts">
    import { scale, fly } from 'svelte/transition';

    import Send from 'lucide-svelte/icons/send'
    import Flame from 'lucide-svelte/icons/flame'
    import LoaderCircle from 'lucide-svelte/icons/loader-circle';

    import StellarExpertLink from '$lib/components/ui/StellarExpertLink.svelte';
    import { wallet } from '$lib/state/Wallet.svelte';
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    let {
        tokenId,
        owner,
        imgUrl,
        title,
    }: { tokenId: number; owner: string; imgUrl: string; title: string } = $props();

    let ownedToken = $derived(wallet.address === owner)
    let showOwnerButtons = $state(false)
    let isLoading = $state({
        transferring: false,
        burning: false,
    })
    let somethingIsLoading = $derived(isLoading.transferring || isLoading.burning)

    function onpointerenter() {
        showOwnerButtons = true
    }
    function onpointerleave() {
        showOwnerButtons = false
    }

    async function tokenTransfer() {
        console.log(`transferring token ${tokenId}`)
        isLoading.transferring = true
        try {
            // do something
            toastStore.trigger({
                message: 'Successfully transferred your NFT. Peace out!!!',
                background: 'variant-filled-success',
            })
        } catch (err: any) {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong transferring NFT. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isLoading.transferring = false
        }
    }

    async function tokenBurn() {
        console.log(`burning token ${tokenId}`)
        isLoading.burning = true
        try {
            // do something
            toastStore.trigger({
                message: 'Successfully burned your NFT. Sorry, you made me do it!',
                background: 'variant-filled-success',
            })
        } catch (err: any) {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong burning NFT. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isLoading.burning = false
        }
    }
</script>

<div {onpointerenter} {onpointerleave} transition:scale class={['card', 'overflow-hidden', ownedToken && 'card-hover']}>
    <header>
        <img src={imgUrl} alt={title} />
    </header>
    <section class="p-4">
        <h5 class="h5" data-toc-ignore>{title}</h5>
        <article>
            <p><strong>Owner:</strong> <StellarExpertLink address={owner} /></p>
        </article>
    </section>
    <footer class="h-8">
        {#if showOwnerButtons}
            <div transition:fly={{ y: 50 }} class={['flex', 'flex-row w-full']}>
                <button onclick={tokenTransfer} class="rounded-none btn btn-sm variant-filled w-1/2" disabled={somethingIsLoading}>
                    <span>
                        {#if isLoading.transferring}
                            <LoaderCircle size={18} class="animate-spin" />
                        {:else}
                            <Send size={18} />
                        {/if}
                    </span>
                    <span>Transfer</span>
                </button>
                <button onclick={tokenBurn} class="rounded-none btn btn-sm variant-filled-error w-1/2" disabled={somethingIsLoading}>
                    <span>
                        {#if isLoading.burning}
                            <LoaderCircle size={18} class="animate-spin" />
                        {:else}
                            <Flame size={18} />
                        {/if}
                    </span>
                    <span>Burn</span>
                </button>
            </div>
        {/if}
    </footer>
</div>
