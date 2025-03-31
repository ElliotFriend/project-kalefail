<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import ArrowRight from 'lucide-svelte/icons/arrow-right';

    import farmField from '$lib/assets/farm-field.avif';
</script>

<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
    <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
        <h2 class="h2">What can I do here?</h2>

        <p>
            Right now, you can trade your hard-earned <code class="code">KALE</code> for different, related
            cultivars! Here's how it works:
        </p>

        <ol class="list text-start">
            <li>
                <span class="badge-icon p-4 variant-soft-primary">1</span>
                <span class="flex-auto"
                    ><a class="anchor" target="_blank" href="https://farm.kalepail.com">Farm</a>
                    some <code class="code">KALE</code></span
                >
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">2</span>
                <span class="flex-auto">Create an account here. (Use the "Signup" button)</span>
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">3</span>
                <span class="flex-auto"
                    >Send some <code class="code">KALE</code> to your new smart wallet</span
                >
            </li>
            <li>
                <span class="badge-icon p-4 variant-soft-primary">4</span>
                <span class="flex-auto"
                    >Visit the <a class="anchor" href="/trading-post">Trading Post</a> to trade your
                    <code class="code">KALE</code> for other, related produce</span
                >
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

        <p>What are you waiting for?</p>
        <div>
            <a href="/trading-post" class="btn variant-filled-primary">
                <span>Get Trading!</span>
                <span><ArrowRight /></span>
            </a>
        </div>
    </div>
    <div class="max-w-[650px] mx-auto">
        <img class="rounded-3xl shadow-xl" alt="Workers in a field, gathering valuable KALE" src={farmField} />
    </div>
</div>
