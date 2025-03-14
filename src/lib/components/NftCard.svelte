<script lang="ts">
    import { scale } from 'svelte/transition';
    import StellarExpertLink from './ui/StellarExpertLink.svelte';

    let {
        tokenId,
        owner,
        imgUrl,
        title,
    }: { tokenId: number; owner: string; imgUrl: string; title: string } = $props();
</script>

<div transition:scale class="card overflow-hidden">
    <header>
        <img src={imgUrl} alt={title} />
    </header>
    <section class="p-4">
        <h5 class="h5" data-toc-ignore>{title}</h5>
        <article>
            <p><strong>Owner:</strong> <StellarExpertLink address={owner} /></p>
        </article>
    </section>
</div>
