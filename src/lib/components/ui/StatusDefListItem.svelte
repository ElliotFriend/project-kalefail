<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK } from '$env/static/public';
    import type { InstanceStorageValue } from '$lib/types';
    import StellarExpertLink from './StellarExpertLink.svelte';

    import Banknote from 'lucide-svelte/icons/banknote';

    let {
        title,
        value,
        isAddress = false,
    }: { title: string; value: InstanceStorageValue; isAddress?: boolean } = $props();
    // console.log('title', title)
    // console.log('value', value)
    // console.log('isAddress', isAddress)
</script>

<div>
    <span class="flex-auto">
        <dt class="font-bold">{title}</dt>
        <dd class="opacity-80">
            {#if typeof value === 'object'}
                <ul class="list">
                    {#each value as vegetable}
                        {@const seHref = `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/asset/${vegetable.assetCode}-${vegetable.issuerAddress}`}
                        <li>
                            <span><Banknote size={20} /></span>
                            <span
                                ><a target="_blank" class="anchor" href={seHref}
                                    ><code class="code">{vegetable.assetCode}</code></a
                                ></span
                            >
                        </li>
                    {/each}
                </ul>
            {:else if typeof value === 'boolean'}
                {value ? 'Open' : 'Closed'}
            {:else if isAddress}
                <StellarExpertLink address={value} />
            {:else}
                {value}
            {/if}
        </dd>
    </span>
</div>
