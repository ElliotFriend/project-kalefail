<script lang="ts">
    import '../app.postcss';

    import Header from '$lib/components/ui/Header.svelte';
    import SidebarDrawer from '$lib/components/ui/SidebarDrawer.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { initializeStores, storePopup, Modal, Toast } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
    initializeStores();
</script>

<Toast />
<SidebarDrawer />
<Modal />

<div class="w-full h-screen flex flex-col overflow-hidden">
    <Header />
    <PageContent>
        <slot />
    </PageContent>
    <Footer />
</div>
