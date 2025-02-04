<script lang="ts">
    import Hero from "$lib/components/landing/Hero.svelte";
    import WhatIsKaleFail from "$lib/components/landing/WhatIsKaleFail.svelte";
    import WhatCanIDo from "$lib/components/landing/WhatCanIDo.svelte";
</script>

<!-- hero -->
<section id="hero">
    <div class="section-container"><Hero /></div>
</section>

<!-- what is it? -->
<section id="what-is-kalefail">
    <div class="section-container"><WhatIsKaleFail /></div>
</section>

<!-- what can i do? -->
<section id="what-is-kalefail">
    <div class="section-container"><WhatCanIDo /></div>
</section>

<style lang="postcss">
    .section-container {
        @apply w-full max-w-7xl mx-auto p-4 py-16 md:py-24
    }
</style>
