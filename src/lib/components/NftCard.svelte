<script lang="ts">
    import { scale, fly } from 'svelte/transition';

    import Send from 'lucide-svelte/icons/send';
    import Flame from 'lucide-svelte/icons/flame';
    import LoaderCircle from 'lucide-svelte/icons/loader-circle';

    import kale_salad from '$lib/contracts/kale_salad';
    import { Api } from '@stellar/stellar-sdk/rpc';

    import StellarExpertLink from '$lib/components/ui/StellarExpertLink.svelte';
    import { wallet } from '$lib/state/Wallet.svelte';
    import { getToastStore, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { account, send } from '$lib/passkeyClient';
    import { keyId } from '$lib/state/keyId';
    import { invalidate } from '$app/navigation';
    const toastStore = getToastStore();
    const modalStore = getModalStore();

    let {
        tokenId,
        owner,
        imgUrl,
        title,
    }: { tokenId: number; owner: string; imgUrl: string; title: string } = $props();

    let ownedToken = $derived(wallet.address === owner);
    let showOwnerButtons = $state(false);
    let isLoading = $state({
        transferring: false,
        burning: false,
    });
    let somethingIsLoading = $derived(isLoading.transferring || isLoading.burning);

    function onpointerenter() {
        showOwnerButtons = true;
    }
    function onpointerleave() {
        showOwnerButtons = false;
    }

    async function tokenTransfer() {
        console.log(`transferring token ${tokenId}`);
        isLoading.transferring = true;

        new Promise<string>((resolve) => {
            const modal: ModalSettings = {
                type: 'prompt',
                title: 'Transfer Token',
                body: `Please enter the address which should receive token #${tokenId}.`,
                buttonTextConfirm: 'Send Token',
                response: (r: string) => {
                    resolve(r);
                },
            };
            modalStore.trigger(modal);
        })
            .then(async (r: string) => {
                if (!r) {
                    throw 'Token transfer cancelled.';
                }

                let at = await kale_salad.transfer({
                    owner: wallet.address,
                    to: r,
                    token_id: tokenId,
                });

                if (Api.isSimulationError(at.simulation!)) {
                    if (at.simulation.error.includes('Error(Contract, #300)')) {
                        throw 'Token does not exist.';
                    } else if (at.simulation.error.includes('Error(Contract, #301)')) {
                        throw 'Incorrect token owner.';
                    } else if (at.simulation.error.includes('Error(Contract, #202)')) {
                        throw 'Only 5 NFTs may be held per address.';
                    }
                    throw at.simulation.error;
                }

                let tx = await account.sign(at.built!, { keyId: $keyId });
                await send(tx.built!);

                toastStore.trigger({
                    message: 'NFT has been transferred. Goodbye, token!',
                    background: 'variant-filled-success',
                });

                invalidate('/api/kitchen');
            })
            .catch((err: unknown) => {
                console.error(err);

                toastStore.trigger({
                    message:
                        err instanceof Error
                            ? err.message
                            : `Something went wrong transferring NFT. ${(err as string) || 'Please try again later.'}`,
                    background: 'variant-filled-error',
                });
            })
            .finally(() => (isLoading.transferring = false));
    }

    async function tokenBurn() {
        console.log(`burning token ${tokenId}`);
        isLoading.burning = true;

        new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'confirm',
                title: 'Confirm Token Burn',
                body: `Are you sure you wish to burn KALE Salad #${tokenId}? This is irreversible and permanent. Neither you, nor anybody else will ever be able to own this token again.`,
                buttonTextCancel: 'Nevermind!',
                buttonTextConfirm: 'Yes, burn it with fire!',
                response: (r: boolean) => {
                    resolve(r);
                },
            };
            modalStore.trigger(modal);
        })
            .then(async (r: boolean) => {
                if (!r) {
                    throw 'Token burn aborted. Phew!';
                }

                console.log(`confirmed. proceeding to burn token ${tokenId}`);

                let at = await kale_salad.burn({
                    owner: wallet.address,
                    token_id: tokenId,
                });

                if (Api.isSimulationError(at.simulation!)) {
                    if (at.simulation.error.includes('Error(Contract, #300)')) {
                        throw 'Token does not exist.';
                    } else if (at.simulation.error.includes('Error(Contract, #301)')) {
                        throw 'Incorrect token owner.';
                    }
                    throw at.simulation.error;
                }

                let tx = await account.sign(at.built!, { keyId: $keyId });
                await send(tx.built!);

                toastStore.trigger({
                    message: 'Womp womp... NFT has been burned. Sorry, you made me do it!',
                    background: 'variant-filled-success',
                });

                invalidate('/api/kitchen');
            })
            .catch((err: unknown) => {
                console.error(err);

                toastStore.trigger({
                    message:
                        err instanceof Error
                            ? err.message
                            : `Something went wrong burning NFT. ${(err as string) || 'Please try again later.'}`,
                    background: 'variant-filled-error',
                });
            })
            .finally(() => (isLoading.burning = false));
    }
</script>

<div
    {onpointerenter}
    {onpointerleave}
    transition:scale
    class={['card', 'overflow-hidden', ownedToken && 'card-hover']}
>
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
        {#if ownedToken && showOwnerButtons}
            <div transition:fly={{ y: 50 }} class={['flex', 'flex-row w-full']}>
                <button
                    onclick={tokenTransfer}
                    class="rounded-none btn btn-sm variant-filled w-1/2"
                    disabled={somethingIsLoading}
                >
                    <span>
                        {#if isLoading.transferring}
                            <LoaderCircle size={18} class="animate-spin" />
                        {:else}
                            <Send size={18} />
                        {/if}
                    </span>
                    <span>Transfer</span>
                </button>
                <button
                    onclick={tokenBurn}
                    class="rounded-none btn btn-sm variant-filled-error w-1/2"
                    disabled={somethingIsLoading}
                >
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
