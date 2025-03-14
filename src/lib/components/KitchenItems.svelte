<script lang="ts">
    import { flip } from "svelte/animate";
    import NftCard from "$lib/components/NftCard.svelte";

    let { nfts } = $props()
</script>

<div class="grid grid-cols-3 gap-4">
    {#each nfts as nft (nft.tokenId)}
        <div animate:flip={{ duration: 500 }}>
            <NftCard tokenId={nft.tokenId} owner={nft.owner} imgUrl={nft.meta.url} />
        </div>
    {/each}
</div>
