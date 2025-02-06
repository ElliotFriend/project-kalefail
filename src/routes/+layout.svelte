<script lang="ts">
    import '../app.postcss';

    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import Balances from '$lib/components/Balances.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    import { initializeStores, Modal, Toast, autoModeWatcher } from '@skeletonlabs/skeleton';
    import type { LayoutProps } from './$types';
    initializeStores();

    let { children }: LayoutProps = $props();
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Toast />
<SidebarDrawer />
<Modal />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <Balances />

    <PageContent>
        {@render children()}
    </PageContent>

    <Footer />
</div>
