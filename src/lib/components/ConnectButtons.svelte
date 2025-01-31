<script lang="ts">
    // We're using toasts to display errors to the user. We're not doing much
    // error _handling_, though. So, use whatever techniques you see fit.
    import {
        clipboard,
        getModalStore,
        getToastStore,
        popup,
        type ModalSettings,
    } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();
    const modalStore = getModalStore();

    import { account, send, getWalletAddress } from '$lib/passkeyClient';
    import { keyId } from '$lib/state/keyId';
    import { wallet } from '$lib/state/Wallet.svelte';
    import StellarExpertLink from '$lib/components/ui/StellarExpertLink.svelte';
    import { page } from '$app/state';

    let userName = $state('');

    /**
     * Sign up as a new user, creating a smart wallet along the way.
     */
    async function signup() {
        console.log('signing up');
        try {
            await new Promise<string>((resolve) => {
                const modal: ModalSettings = {
                    type: 'prompt',
                    title: 'Enter Name',
                    body: 'Please provide a username below.',
                    valueAttr: { type: 'text', required: true },
                    response: (r: string) => resolve(r),
                };
                modalStore.trigger(modal);
            }).then((r) => (userName = r));

            const { keyIdBase64, contractId, signedTx } = await account.createWallet(
                'The KALEfail Project',
                userName,
            );

            await send(signedTx);

            keyId.set(keyIdBase64);
            console.log('keyId', $keyId);
            wallet.address = contractId;
            console.log('walletAddress', wallet.address);
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    /**
     * Log in as an existing user, connecting to a pre-existing smart wallet.
     */
    async function login() {
        console.log('logging in');
        try {
            const { keyIdBase64, contractId } = await account.connectWallet({
                getContractId: getWalletAddress,
            });

            keyId.set(keyIdBase64);
            console.log('keyId', $keyId);
            wallet.address = contractId;
            console.log('walletAddress', wallet.address);

            wallet.getBalances(page.data.vegetables);
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    /**
     * Log out from the current user session.
     */
    async function logout() {
        console.log('logging out');
        try {
            keyId.reset();
            wallet.reset();
            localStorage.removeItem('kf:keyId');
            window.location.reload();
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }
</script>

<div class="flex space-x-1 md:space-x-2 items-center">
    {#if !wallet.address}
        <button class="btn btn-sm variant-filled-primary" onclick={signup}>Signup</button>
        <button class="btn btn-sm variant-soft-primary" onclick={login}>Login</button>
    {:else}
        <StellarExpertLink address={wallet.address} />
        <button class="btn btn-sm variant-soft-error" onclick={logout}>Logout</button>
    {/if}
</div>
