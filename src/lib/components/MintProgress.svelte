<script lang="ts">
    import { ProgressBar } from '@skeletonlabs/skeleton';

    import { page } from '$app/state';
    let kitchen = page.data.kitchen;
</script>

<div class="flex flex-col gap-2">
    <div class="flex flex-row justify-between">
        <span
            ><strong
                >{Number((kitchen.mintIndex / kitchen.maxToMint) * 100).toFixed(1)}% minted</strong
            ></span
        >
        <span>{kitchen.mintIndex} / {kitchen.maxToMint}</span>
    </div>
    <div>
        <ProgressBar value={kitchen.mintIndex} max={kitchen.maxToMint} />
    </div>
</div>
