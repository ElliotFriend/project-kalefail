<script lang="ts">
    import type { PageData } from './$types';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import NftCard from '$lib/components/ui/NftCard.svelte';

    let { data }: { data: PageData } = $props();
    console.log('here is pagedata props', data)
    let totalSupply = $state(5)

    let tabSet: number = $state(0);
</script>

<h1 class="h1">Kitchen</h1>

<p>
    Bored of getting all your nutrients one vegetable at a time? Yeah, me too! Here, in the kitchen,
    cook up some ways to make your diet more interesting and unique!
</p>

<p>Coming soon...</p>

<TabGroup>
    <Tab bind:group={tabSet} name="tab-overview" value={0}>Overview</Tab>
    <Tab bind:group={tabSet} name="tab-items" value={1}>Items</Tab>
    <Tab bind:group={tabSet} name="tab-owned" value={2}>Your NFTs</Tab>

    <svelte:fragment slot="panel">
        {#if tabSet === 0}
            Overview page content
        {:else if tabSet === 1}
            View all minted NFTs
        {:else if tabSet === 2}
            View your owned NFTs
        {/if}
    </svelte:fragment>
</TabGroup>

<p>
    Your NFTs
</p>

<div class="grid grid-cols-3 gap-4">
    {#each { length: totalSupply }, i}
        <NftCard tokenId={i} />
    {/each}
</div>

<p>
    Buy NFTs
</p>


<!-- <section class="grid grid-cols-2 md:grid-cols-3 gap-4">
	<div>
		<img class="h-auto max-w-full rounded-lg" src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=3008&h=3008&auto=format&fit=crop" alt="">
	</div>
	<div>
		<img class="h-auto max-w-full rounded-lg" src="https://images.unsplash.com/photo-1553184570-557b84a3a308?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzY2NTF8&ixlib=rb-4.0.3&w=3008&h=3008&auto=format&fit=crop" alt="">
	</div>
	<div>
		<img class="h-auto max-w-full rounded-lg" src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=3008&h=3008&auto=format&fit=crop" alt="">
	</div>
</section> -->
