<script lang="ts">
    import { scale, fly } from 'svelte/transition';

    import Send from 'lucide-svelte/icons/send'
    import Flame from 'lucide-svelte/icons/flame'
    import LoaderCircle from 'lucide-svelte/icons/loader-circle';

    import kale_salad from '$lib/contracts/kale_salad';
    import { Operation, TransactionBuilder, Keypair, Networks, nativeToScVal, TimeoutInfinite } from '@stellar/stellar-sdk'
    import { Api } from '@stellar/stellar-sdk/rpc';

    import StellarExpertLink from '$lib/components/ui/StellarExpertLink.svelte';
    import { wallet } from '$lib/state/Wallet.svelte';
    import { getToastStore, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { account, rpc, send } from '$lib/passkeyClient';
    import { keyId } from '$lib/state/keyId';
    const toastStore = getToastStore();
    const modalStore = getModalStore();


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

        // const kp = Keypair.fromSecret('SAXLZORBSBENITI2WIK7WGX5DJZMY3P444S7P6WDEGBHCH7L3ARPEKD4') // GCC4I5COXGB3UUHSIQISGDX5BLDWILC5PVD6BI2F3W2O54YTYSVJ5EDM
        // let account = await rpc.getAccount(kp.publicKey());

        // let tx = new TransactionBuilder(account, {
        //     networkPassphrase: Networks.TESTNET,
        //     fee: "100000",
        // }).addOperation(Operation.invokeContractFunction({
        //     contract: 'CBOGCH2B2XDT3JSXDOUZIZJA43WTQCHLJYEOATQBTB37XC2BT7KU2F5S',
        //     function: 'transfer',
        //     args: [
        //         nativeToScVal('GCC4I5COXGB3UUHSIQISGDX5BLDWILC5PVD6BI2F3W2O54YTYSVJ5EDM', { type: 'address' }),
        //         nativeToScVal('CCODRMNPWUNU46GS6L6ASXZKMPZE7SIVEIXCSBEL4TRWE5W7DZ3CE3MI', { type: 'address' }),
        //         nativeToScVal(7, { type: 'u32' }),
        //     ],
        // }))
        // .setTimeout(TimeoutInfinite)
        // .build()

        // console.log('here you go', tx.toXDR())

        new Promise<string>((resolve) => {
            const modal: ModalSettings = {
                type: 'prompt',
                title: 'Transfer Token',
                body: `Please enter the address which should receive token #${tokenId}.`,
                buttonTextConfirm: 'Send Token',
                response: (r: string) => {
                    resolve(r)
                }
            }
            modalStore.trigger(modal)
        }).then(async (r: any) => {
            if (!r) {
                throw 'Token transfer cancelled.'
            }

            let at = await kale_salad.transfer({
                owner: wallet.address,
                to: r,
                token_id: tokenId,
            })

            if (Api.isSimulationError(at.simulation!)) {
                if (at.simulation.error.includes('Error(Contract, #300)')) {
                    throw 'Token does not exist.';
                } else if (at.simulation.error.includes('Error(Contract, #301)')) {
                    throw 'Incorrect token owner.';
                } else if (at.simulation.error.includes('Error(Contract, #202)')) {
                    throw 'Only 5 NFTs may be held per account.';
                }
                throw '';
            }

            let tx = await account.sign(at.built!, { keyId: $keyId })
            await send(tx.built!)

            toastStore.trigger({
                message: 'NFT has been transferred. Goodbye, token!',
                background: 'variant-filled-success',
            })
        }).catch((err: any) => {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong transferring NFT. Please try again later.',
                background: 'variant-filled-error',
            });
        }).finally(() => isLoading.transferring = false)
    }

    async function tokenBurn() {
        console.log(`burning token ${tokenId}`)
        isLoading.burning = true
        new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'confirm',
                title: 'Confirm Token Burn',
                body: `Are you sure you wish to burn KALE Salad #${tokenId}? This is irreversible and permanent. Neither you, nor anybody else will ever be able to own this token again.`,
                buttonTextCancel: 'Nevermind!',
                buttonTextConfirm: 'Yes, burn it with fire!',
                response: (r: boolean) => {
                    resolve(r)
                }
            }
            modalStore.trigger(modal)
        }).then(async (r: any) => {
            if (!r) {
                throw 'Token burn aborted. Phew!'
            }

            console.log(`confirmed. proceeding to burn token ${tokenId}`)

            let at = await kale_salad.burn({
                owner: wallet.address,
                token_id: tokenId,
            })

            if (Api.isSimulationError(at.simulation!)) {
                if (at.simulation.error.includes('Error(Contract, #300)')) {
                    throw 'Token does not exist.';
                } else if (at.simulation.error.includes('Error(Contract, #301)')) {
                    throw 'Incorrect token owner.';
                }
                throw '';
            }

            let tx = await account.sign(at.built!, { keyId: $keyId })
            await send(tx.built!)

            toastStore.trigger({
                message: 'Womp womp... NFT has been burned. Sorry, you made me do it!',
                background: 'variant-filled-success',
            })
        }).catch((err: any) => {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong burning NFT. Please try again later.',
                background: 'variant-filled-error',
            });
        }).finally(() => isLoading.burning = false)
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
        {#if ownedToken && showOwnerButtons}
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
