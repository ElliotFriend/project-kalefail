<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK } from '$env/static/public';
    import Truncated from '$lib/components/ui/Truncated.svelte';

    let { address }: { address: string } = $props();

    let seHref = address.startsWith('C')
        ? `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${address}`
        : `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/account/${address}`;
</script>

<a href={seHref} target="_blank" class="anchor"><Truncated text={address} /></a>
