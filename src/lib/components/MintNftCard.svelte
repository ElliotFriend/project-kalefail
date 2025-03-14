<script lang="ts">
    import { account, send } from "$lib/passkeyClient";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import kale_salad from "$lib/contracts/kale_salad";
    import { wallet } from "$lib/state/Wallet.svelte";
    import { keyId } from "$lib/state/keyId";
    import { invalidate } from "$app/navigation";
    import { Api } from "@stellar/stellar-sdk/rpc";
    import StatusDefListItem from "./ui/StatusDefListItem.svelte";
    import { page } from "$app/state";
    const toastStore = getToastStore();

    let maxPerAccount = $state(5)
    let nftsToMint = $state(1)
    let isMinting = $state(false)

    async function mintSalad() {
        console.log('minting NFTs')
        isMinting = true
        try {
            // do something
            let at = await kale_salad.mint_salad({
                owner: wallet.address,
                number_of_tokens: nftsToMint,
            })

            if (Api.isSimulationError(at.simulation!)) {
                if (at.simulation.error.includes('Error(Contract, #2)')) {
                    throw 'Only 5 NFTs may be minted per account.'
                }
                throw ''
            }

            let tx = await account.sign(at.built!, { keyId: $keyId })
            await send(tx.built!);

            toastStore.trigger({
                message: 'Successfully minted your NFTs. Congrats!!',
                background: 'variant-filled-success',
            });
            invalidate('/api/kitchen')
        } catch (err: any) {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong minting NFTs. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isMinting = false
        }
    }
</script>

<div class="card p-4 space-y-4">
    <h3 class="h3" data-toc-ignore>Mint Your Own Salad</h3>

    <dl class="list-dl">
        <StatusDefListItem
            title="NFT Contract Address"
            value={kale_salad.options.contractId}
            isAddress
        />
        <StatusDefListItem
            title="Max NFTs Per Address"
            value="5"
        />
    </dl>

    <label class="label">
        <span>Number of Tokens</span>
        <input title="Number of Tokens" class="input" type="number" max={maxPerAccount} min={1} bind:value={nftsToMint} />
    </label>
    <button class="btn variant-filled w-full" onclick={mintSalad} disabled={isMinting}>Mint</button>
</div>
