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
            name: 'Apple',
            href: '#',
            icon: Apple,
        },
        {
            name: 'Book',
            href: '#',
            icon: Book,
        },
        {
            name: 'Castle',
            href: '#',
            icon: Castle,
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
    import Apple from 'lucide-svelte/icons/apple';
    import Book from 'lucide-svelte/icons/book';
    import Castle from 'lucide-svelte/icons/castle';

    import ConnectButtons from '$lib/components/ConnectButtons.svelte';
</script>

<header class="flex-none shadow-xl z-5">
    <div class="flex flex-col bg-surface-100-800-token space-y-4 p-3 md:p-4">
        <div class="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8">
            <!-- The "hamburger" button will not appear on large screens -->
            <div class="lg:!hidden self-center">
                <button class="btn-icon btn-icon-sm" onclick={() => drawerStore.open()}>
                    <Menu />
                </button>
            </div>
            <div class="flex-none flex items-center">
                <a href="/" title="Dapp homepage">
                    <span class="text-lg md:text-xl"> Dapp Title </span>
                </a>
            </div>
            <!-- The "topnav" buttons will not appear on medium or smaller screens -->
            <div class="hidden lg:block flex lg:space-x-4">
                {#each menuItems as item}
                    <a href={item.href} class="btn hover:variant-soft-primary">
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
