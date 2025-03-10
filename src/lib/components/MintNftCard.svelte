<script lang="ts">
    let maxPerAccount = $state(5)
</script>

<div class="card p-4 space-y-4">
    <h3 class="h3" data-toc-ignore>Mint Your Own Salad</h3>
    <p>Mint your own NFT below. The price you're specifying </p>
    <input class="input" type="number" max={maxPerAccount} min={0} />
    <button class="btn variant-filled">Mint</button>
</div>
