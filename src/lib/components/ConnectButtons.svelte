<script lang="ts">
    // We're using toasts to display errors to the user. We're not doing much
    // error _handling_, though. So, use whatever techniques you see fit.
    import { clipboard, getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    import Copy from 'lucide-svelte/icons/copy';
    import { account, getWalletAddress, deploy } from '$lib/passkeyClient';
    import { PasskeyClient } from 'passkey-kit';
    import { keyId } from '$lib/state/keyId';
    import { wallet } from '$lib/state/Wallet.svelte';
    import StellarExpertLink from '$lib/components/ui/StellarExpertLink.svelte';
    import base64url from 'base64url';
    import { PUBLIC_STELLAR_NETWORK_PASSPHRASE, PUBLIC_STELLAR_RPC_URL } from '$env/static/public';
    import { onMount } from 'svelte';

    onMount(async () => {
        if ($keyId) {
            console.log('keyId', $keyId);
            const { contractId } = await account.connectWallet({
                keyId: $keyId,
                getContractId: getWalletAddress,
            });

            wallet.address = contractId;
            console.log('walletAddress', wallet.address);
            wallet.getWasmHash();
        }
    });

    /**
     * Sign up as a new user, creating a smart wallet along the way.
     */
    async function signup() {
        console.log('signing up');
        try {
            const { keyIdBase64, publicKey } = await account.createKey(
                'The KaleFail Project',
                'KaleFail User',
            );

            const { contractId } = await deploy(keyIdBase64, base64url(publicKey));

            account.wallet = new PasskeyClient({
                contractId,
                rpcUrl: PUBLIC_STELLAR_RPC_URL,
                networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            });

            keyId.set(keyIdBase64);
            console.log('keyId', $keyId);
            wallet.address = contractId;
            console.log('wallet.address', wallet.address);
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

            wallet.getWasmHash();
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
        <button class="btn-icon btn-icon-sm" use:clipboard={wallet.address}
            ><Copy size="14" /></button
        >
        <button class="btn btn-sm variant-soft-error" onclick={logout}>Logout</button>
    {/if}
</div>
