<script lang="ts">
    let { totalMinted, maxToMint } = $props();
    import { ProgressBar } from "@skeletonlabs/skeleton";
</script>

<div class="grid gap-2">
    <div class="flex justify-between">
        <span><strong>{Number(totalMinted / maxToMint * 100).toFixed(1)}% minted</strong></span>
        <span>{totalMinted} / {maxToMint}</span>
    </div>
    <div>
        <ProgressBar value={totalMinted} max={maxToMint} />
    </div>
</div>
