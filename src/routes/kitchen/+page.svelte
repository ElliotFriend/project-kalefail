<script lang="ts">
    import type { PageProps } from './$types';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import KitchenOverview from '$lib/components/KitchenOverview.svelte';
    import KitchenItems from '$lib/components/KitchenItems.svelte';
    import { wallet } from '$lib/state/Wallet.svelte';
    import PageHeader from '$lib/components/ui/PageHeader.svelte';

    let { data }: PageProps = $props();
    let tabSet: number = $state(0);
    //@ts-ignore
    data.kitchen.mintedNfts.sort((a, b) => a.tokenId - b.tokenId);
    let displayOwnedNfts = $state(false);
    let nftsToDisplay = $derived(
        //@ts-ignore
        data.kitchen.mintedNfts.filter((nft) =>
            displayOwnedNfts ? nft.owner === wallet.address : true,
        ),
    );

    function displayAllNfts() {
        displayOwnedNfts = false;
    }
    function displayOnlyOwnedNfts() {
        displayOwnedNfts = true;
    }
</script>

<PageHeader
    title="The Kitchen"
    subtitle="Bored of getting all your nutrients one vegetable at a time? Yeah, me too! Here, in the kitchen,
    cook up some ways to make your diet more interesting and unique!"
    showDivider={false}
/>

<div class="w-full">
    <TabGroup>
        <Tab bind:group={tabSet} name="tab-overview" value={0}>Overview</Tab>
        <Tab bind:group={tabSet} name="tab-items" value={1} onclick={displayAllNfts}>Mints</Tab>
        <Tab bind:group={tabSet} name="tab-owned" value={2} onclick={displayOnlyOwnedNfts}
            >Your NFTs</Tab
        >

        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <KitchenOverview />
            {:else if data.kitchen.mintIndex > 0 && nftsToDisplay.length}
                <KitchenItems nfts={nftsToDisplay} />
            {:else if tabSet === 2 && !wallet.address}
                <p>Please login first.</p>
            {:else}
                <p>No NFTs have been minted yet.</p>
            {/if}
        </svelte:fragment>
    </TabGroup>
</div>
