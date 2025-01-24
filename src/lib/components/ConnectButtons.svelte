<!--
 @component
 This component holds the buttons and logic for our signup/login/logout
 functionality. We're keeping the button UI and function logic in the same file
 for the sake of simplicity. This component is then imported and used in the
 `$lib/components/ui/Header.svelte` component, which in turn is placed on the
 page in the `/src/routes/+layout.svelte` file.

 In its bare state, all the buttons will always show, and there's no actual
 logging in, signing up, etc. taking place. We've also not pre-coded any way to
 _store_ the passkey ID or smart wallet address, once it is known. Perhaps for
 that, you'll use a database, or localStorage, or something else entirely. It's
 up to _you_ to provide the functionality you want to see here, this component
 is merely a canvas for you to paint on.

 We do provide some toast logic for informing users of errors, but you can
 modify/delete that as you see fit.
-->

<script lang="ts">
    // We're using toasts to display errors to the user. We're not doing much
    // error _handling_, though. So, use whatever techniques you see fit.
    import { clipboard, getModalStore, getToastStore, popup, type ModalSettings } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();
    const modalStore = getModalStore();

    import { account, send, getWalletAddress } from '$lib/passkeyClient';
    import { keyId } from '$lib/stores/keyId';
    import { walletAddress } from '$lib/stores/walletAddress';

    let userName = $state('')

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
            }).then((r) => (userName = r))

            const {
                keyIdBase64,
                contractId,
                signedTx,
            } = await account.createWallet('The KALEfail Project', userName);

            await send(signedTx)

            keyId.set(keyIdBase64);
            console.log('keyId', $keyId)
            walletAddress.set(contractId);
            console.log('walletAddress', $walletAddress)
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
            console.log('keyId', $keyId)
            walletAddress.set(contractId);
            console.log('walletAddress', $walletAddress)
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
            walletAddress.set('');
            localStorage.removeItem('kf:keyId')
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

<div class="flex space-x-1 md:space-x-2">
    {#if !$walletAddress}
        <button class="btn variant-filled-primary" onclick={signup}>Signup</button>
        <button class="btn variant-soft-primary" onclick={login}>Login</button>
    {:else}
        <button class="btn variant-soft-error" onclick={logout}>Logout</button>
    {/if}
</div>
