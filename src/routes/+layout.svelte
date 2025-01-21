<script lang="ts">
    import '../app.postcss';
    import { initializeStores, Toast } from '@skeletonlabs/skeleton';
    initializeStores();

    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';
</script>

<Toast />
<SidebarDrawer />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        <slot />
    </PageContent>
    <Footer />
</div>
