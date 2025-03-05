<script lang="ts">
    import { onMount } from "svelte";
    let { tokenId } = $props()
    let baseUri = 'https://ipfs.io/ipfs/bafybeie3mktwdqsslpdvgxat2cgbkseiln6dnrd7pwitsiq7jel74g4qr4/'
    let tokenUri = baseUri + tokenId;
    let imgUrl = $state('')
    // let tokenMeta = await fetch(`${baseUri}${tokenId}`)
    let tokenMeta: Record<string, any> = $state({});
    async function getTokenMeta() {
        let results = await fetch(tokenUri);

        if (results.ok) {
            let jso = await results.json()
            // console.log('results', jso.url)
            imgUrl = jso.url
            tokenMeta = jso
        }
        // console.log('meta', tokenMeta)
    }

    onMount(() => {
        getTokenMeta();
    })
</script>

<div class="card card-hover overflow-hidden">
    <header>
        <img src={imgUrl} alt={`KALE Salad #${tokenId}`} />
    </header>
    <section class="p-4">
        (content)
    </section>
    <footer class="card-footer">(footer)</footer>
</div>
