<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';

    import ArrowRight from 'lucide-svelte/icons/arrow-right';
    import kalePail from '$lib/assets/kalepail.avif'
</script>

<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
    <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
        <h1 class="h1">Welcome to KaleFail!</h1>
        <p class="!text-xl max-w-[475px]">
            It all started with <a href="https://kalepail.com" target="_blank" class="anchor"><code class="code">KALE</code></a>. A pail full of it, to be precise.
        </p>
        <p class="!text-xl max-w-[475px]">
            But, times have grown quiet. The whales are hungry for more varieties, and want more nutrients.
        </p>
        <p class="!text-xl max-w-[475px]">Today, we make that possible. Here's how it works:</p>

        <ol class="list text-start">
            <li>
                <span class="badge-icon p-4 variant-soft-primary">1</span>
                <span class="flex-auto"><a class="anchor" target="_blank" href="https://farm.kalepail.com">Farm</a> some <code class="code">KALE</code></span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">2</span>
                <span class="flex-auto">Create an account here. (Use the "Signup" button)</span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">3</span>
                <span class="flex-auto">Send some <code class="code">KALE</code> to your new smart wallet</span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">4</span>
                <span class="flex-auto">Visit the <a class="anchor" href="/trading-post">Trading Post</a> to trade your <code class="code">KALE</code> for other, related produce</span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">5</span>
                <span class="flex-auto">TODO...</span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">6</span>
                <span class="flex-auto">Profit??</span>
            </li>
        </ol>

        <p class="!text-xl max-w-[475px]">What are you waiting for?</p>
        <div>
            <a href="/trading-post" class="btn variant-filled-primary">
                <span>Get Trading!</span>
                <span><ArrowRight /></span>
            </a>
        </div>
    </div>
    <div class="max-w-[650px] mx-auto">
        <Avatar actionParams="#BlueNight" width="w-96" shadow="shadow-xl" rounded="rounded-3xl">
            <img
                alt="A brave farmer, presenting his pail-full of KALE"
                src={kalePail}
            />
        </Avatar>
    </div>
</div>
