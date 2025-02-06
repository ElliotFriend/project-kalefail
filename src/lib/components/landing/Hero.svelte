<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import kalePail from '$lib/assets/kalepail.avif';
</script>

<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
    <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4">
        <h1 class="h1">Welcome to KaleFail!</h1>
        <p class="!text-xl max-w-[475px]">
            It all started with <a href="https://kalepail.com" target="_blank" class="anchor"
                ><code class="code">KALE</code></a
            >. A pail full of it, to be precise.
        </p>
        <p class="!text-xl max-w-[475px]">
            But, times have grown quiet. The whales are hungry for more varieties, and want more
            nutrients.
        </p>
        <p class="!text-xl max-w-[475px]">Today, we make that possible.</p>
    </div>
    <div class="max-w-[650px] mx-auto">
        <Avatar actionParams="#BlueNight" width="w-96" shadow="shadow-xl" rounded="rounded-3xl">
            <img alt="A brave farmer, presenting his pail-full of KALE" src={kalePail} />
        </Avatar>
    </div>
</div>
