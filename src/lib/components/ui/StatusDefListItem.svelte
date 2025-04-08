<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK } from '$env/static/public';
    import type { InstanceStorageValue } from '$lib/types';
    import StellarExpertLink from './StellarExpertLink.svelte';

    import Banknote from 'lucide-svelte/icons/banknote';
    import Dot from 'lucide-svelte/icons/dot';
    import Truncated from './Truncated.svelte';

    let {
        title,
        value,
        isAddress = false,
        isHex = false,
    }: {
        title: string;
        value: InstanceStorageValue | string[];
        isAddress?: boolean;
        isHex?: boolean;
    } = $props();
</script>

<div>
    <span class="flex-auto max-w-full">
        <dt class="font-bold">{title}</dt>
        <dd class="opacity-80">
            {#if typeof value === 'object'}
                <ul class="list">
                    {#each value as v, i (i)}
                        {#if typeof v !== 'string'}
                            {@const seHref = `https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/asset/${v.assetCode}-${v.issuerAddress}`}
                            <li>
                                <span><Banknote size={20} /></span>
                                <span
                                    ><a target="_blank" class="anchor" href={seHref}
                                        ><code class="code">{v.assetCode}</code></a
                                    ></span
                                >
                            </li>
                        {:else}
                            <li>
                                <span><Dot size={20} /></span>
                                <span class="flex-auto">{v}</span>
                            </li>
                        {/if}
                    {/each}
                </ul>
            {:else if typeof value === 'boolean'}
                {value ? 'Open' : 'Closed'}
            {:else if typeof value === 'string'}
                {#if isAddress}
                    <StellarExpertLink address={value} />
                {:else if isHex}
                    <Truncated text={value} startChars={8} endChars={8} />
                {:else}
                    {value}
                {/if}
            {:else}
                {value}
            {/if}
        </dd>
    </span>
</div>
