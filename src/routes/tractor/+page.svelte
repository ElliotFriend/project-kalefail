<script lang="ts">
    import kale_tractor from '$lib/contracts/kale_tractor';
    import { send } from '$lib/passkeyClient';
    import { scValToBigInt, xdr } from '@stellar/stellar-sdk';
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    let farmerAddress = $state('CC4RLF6LVFPDMPTWYB2NR7HEUTEDIHZX7WQZOJLEIWOE6Z36EPBCSXHQ')
    let harvestablePails: number[] = $state([])
    let selectedPails: number[] = $state([])
    let isFetching = $state(false)
    let isHarvesting = $state(false)

    async function fetchPails() {
        console.log('finding pails')
        isFetching = true
        try {
            let tractorRes = await fetch(`/api/tractor/${farmerAddress}`)
            let tractorJson = await tractorRes.json()

            if (!tractorRes.ok) {
                throw tractorJson.message
            }

            harvestablePails = tractorJson.pails
            // selectedPails = tractorJson.pails
        } catch (err: any) {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong fetching pails. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isFetching = false
        }
    }

    async function harvestPails() {
        console.log('harvesting pails')
        isHarvesting = true
        try {
            let at = await kale_tractor.harvest({
                farmer: farmerAddress,
                pails: selectedPails,
            })

            let { returnValue } = await send(at.built!);
            let reward = scValToBigInt(xdr.ScVal.fromXDR(returnValue, 'base64'))

            toastStore.trigger({
                message: `Sweet!! You successfully harvested ${(Number(reward) / 10_000_000).toFixed(7)} KALE.`,
                background: 'variant-filled-success',
            })
        } catch (err: any) {
            console.error('error', err)

            toastStore.trigger({
                message: err || 'Something went wrong harvesting pails. Please try again later.',
                background: 'variant-filled-error',
            });
        } finally {
            isHarvesting = false
            fetchPails()
        }
    }
</script>

<h1 class="h1">The Tractor</h1>

<p>Welcome to the heavy duty tractor. Where all your harvest dreams come true!</p>

<label class="label">
    <span>Find all harvestable pails for...</span>
    <input class="input" type="text" placeholder="Enter address here" bind:value={farmerAddress} />
</label>
<button class="btn variant-filled" disabled={isFetching} onclick={fetchPails}>Fetch Pails</button>


{#if harvestablePails.length}
    <p>Please select which blocks you'd like to harvest:</p>

    <div class="space-y-2">
        {#each harvestablePails as pail}
            <label class="flex items-center space-x-2">
                <input class="checkbox" type="checkbox" value={pail} bind:group={selectedPails} />
                <p>{pail}</p>
            </label>
        {/each}
    </div>

    <button class="btn variant-filled" disabled={isHarvesting || isFetching} onclick={harvestPails}>Harvest KALE</button>
{/if}
