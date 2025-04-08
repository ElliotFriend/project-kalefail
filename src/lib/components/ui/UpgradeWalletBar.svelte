<script lang="ts">
    import { slide } from 'svelte/transition';
    import { wallet } from '$lib/state/Wallet.svelte';
</script>

{#if wallet.upgradeAvailable}
    <div transition:slide class="flex bg-error-100-800-token p-2">
        <div class="flex gap-2 items-center mx-auto">
            <div>Wallet upgrade available</div>
            <a href="/upgrade" class="btn btn-sm variant-filled-secondary">Upgrade Now</a>
        </div>
    </div>
{/if}
