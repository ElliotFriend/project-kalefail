<script lang="ts">
    import { onMount } from 'svelte';
    import { rpc } from '$lib/passkeyClient';
    import { nativeToScVal, scValToNative, xdr } from '@stellar/stellar-sdk';
    import { contract } from 'trading_post';
    import TruncatedAddress from './ui/TruncatedAddress.svelte';
    import { fade, scale } from 'svelte/transition';
    import StellarExpertLink from './ui/StellarExpertLink.svelte';
    import { page } from '$app/state';

    let { tokenId, owner, imgUrl }: { tokenId: number; owner: string; imgUrl: string } = $props();
    let tokenUri = `${page.data.baseUri}${tokenId}`;
    // let tokenUri = `https://gateway.pinata.cloud/ipfs/bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/249`;
    // let imgUrl = $state('')
    // let tokenMeta = await fetch(`${baseUri}${tokenId}`)
    let tokenMeta: Record<string, any> = $state({});
    async function getTokenMeta() {
        let results = await fetch(tokenUri);
        // console.log('results', results)

        if (results.ok) {
            let jso = await results.json();
            // console.log('results', jso.url)
            imgUrl = jso.url;
            tokenMeta = jso;
        }
        // console.log('meta', tokenMeta)
    }

    // async function getTokenOwner() {
    //     let results = await rpc.getContractData(
    //         'CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV',
    //         nativeToScVal([
    //             nativeToScVal('Balance', { type: 'symbol' }),
    //             nativeToScVal('CBMGLZ2ZDEJFXIUEO4L3VQO5OKS4CLY3VCYXRZAGFNEIDFIDPWZV23VB', { type: 'address' }),
    //         ]),
    //     )
    //     console.log('results', scValToNative(results.val.contractData().val()))
    // }

    // onMount(() => {
    //     getTokenMeta();
    //     // getTokenOwner();
    // })

    let title = $derived(`KALE Salad #${tokenId}`);
    // owner = 'GCCLIAXRIPHMJPK322CDHLRTT7M4G6MAORCKWGYMWXQANECG6D5WST5Z'
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
