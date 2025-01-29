<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK } from "$env/static/public";

    let { address, startChars = 4, endChars = 4 }: { address: string, startChars?: number, endChars?: number } = $props();

    let seHref = address.startsWith('C')
        ? `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${address}`
        : `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/account/${address}`

    let shortenedAddress = `${address.slice(0, startChars)}...${address.slice(endChars * -1)}`
</script>

<a href={seHref} target="_blank" class="link"><code class="code">{shortenedAddress}</code></a>
