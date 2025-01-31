<script lang="ts">
    let {
        address,
        startChars = 4,
        endChars = 4,
    }: { address: string; startChars?: number; endChars?: number } = $props();

    let shortenedAddress = `${address.slice(0, startChars)}...${address.slice(endChars * -1)}`;
</script>

<code class="code">{shortenedAddress}</code>
