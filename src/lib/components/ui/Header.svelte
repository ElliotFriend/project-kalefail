<!--
 @component
 This `Header` component will be placed at the top of each page, as part of our
 template's barebones structure. It's imported and placed in the
 `/src/routes/+layout.svelte` file. This component displays in the header:

 - The "hamburger" button to expand the nav menu, only on small screens
 - The site title
 - Some menu buttons
 - The `$lib/components/ConnectButtons.svelte` component
-->

<script module>
    // We're using `<script module>` here because the menu items are not in need
    // of reactivity, and this will allow us to export and then import the same
    // items into the sidebar (for smaller screens) without having to redefine
    // the same items.

    /**
     * Change these menu items to fit whatever your use-case is.
     */
    export const menuItems = [
        {
            name: 'Trading Post',
            href: '/trading-post',
            icon: Store,
        },
        {
            name: 'Kitchen',
            href: '/kitchen',
            icon: CookingPot,
        },
    ];
</script>

<script lang="ts">
    // The "Drawer" is the way Skeleton describes the responsive menu that can
    // appear on the side of the page for smaller screens (when the header
    // "hamburger button" is clicked).
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    // We import the Icons in this manner to give us faster build and load
    // times. So says the [Lucide Svelte
    // docs](https://lucide.dev/guide/packages/lucide-svelte#example), at least.
    import Menu from 'lucide-svelte/icons/menu';
    import Store from 'lucide-svelte/icons/store';
    import CookingPot from 'lucide-svelte/icons/cooking-pot';

    import ConnectButtons from '$lib/components/ConnectButtons.svelte';
    import { page } from '$app/state';
    import { wallet } from '$lib/state/Wallet.svelte';
    import Balances from '../Balances.svelte';
</script>

<header class="flex-none shadow-xl">
    <div class="flex flex-col bg-surface-100-800-token space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <!-- The "hamburger" button will not appear on large screens -->
            <div class="md:!hidden self-center">
                <button class="btn-icon btn-icon-sm" onclick={() => drawerStore.open()}>
                    <Menu />
                </button>
            </div>
            <div class="flex-none flex items-center">
                <a href="/" title="Dapp homepage">
                    <span class="text-lg"> 🥬 KaleFail </span><sup>TM</sup>
                </a>
            </div>
            <!-- The "topnav" buttons will not appear on small or smaller screens -->
            <div class="hidden md:block flex md:space-x-4">
                {#each menuItems as item}
                    {@const className = `btn btn-sm hover:variant-soft-primary${page.url.pathname.startsWith(item.href) ? ' variant-soft-primary' : ''}`}
                    <a href={item.href} class={className}>
                        <span><item.icon /></span>
                        <span>{item.name}</span>
                    </a>
                {/each}
            </div>
            <!-- The login/logout/signup buttons will always appear in the header -->
            <div>
                <ConnectButtons />
            </div>
        </div>
    </div>
</header>
