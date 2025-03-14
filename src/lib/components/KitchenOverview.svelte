<script lang="ts">
    import MintProgress from '$lib/components/MintProgress.svelte';
    import MintNftCard from '$lib/components/MintNftCard.svelte';
    import { page } from '$app/state';

    let pricePerNft = $state(page.data.kitchen.pricePerNft / 10_000_000);
    let pricePerVegetable = $derived(pricePerNft / 4);
</script>

<p class="mb-6">
    Mint your own NFT below. The price per NFT is <code class="code">{pricePerNft} KALE</code>.
    However, this will be paid from your balance of each of the available vegetables from the
    trading post. That means your account must hold at least
    <code class="code">{pricePerVegetable}</code> of each vegetable in order to mint an NFT.
</p>

<div class="w-full grid grid-cols-1 md:items-center md:grid-cols-2 gap-8">
    <div>
        <img
            class="rounded-2xl"
            src="https://ipfs.io/ipfs/QmS2AV5RqMti1MnVGDVsnic5oAWDrpE6qLpbjxPYHebCsP"
            alt="The very first KALE salad to be minted."
        />
    </div>
    <div class="flex flex-col justify-center gap-6">
        <MintProgress />
        <MintNftCard />
    </div>
</div>
