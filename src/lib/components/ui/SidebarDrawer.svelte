<!--
 @component
 The `SidebarDrawer` component is the responsive menu that can appear on the
 side of the page for smaller screens, when the "hamburger button" is
 clicked/tapped.
-->

<script lang="ts">
    import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    // We import the `menuItems` array that is exported from the `<script
    // module>` part of the Header component. This way, we can have the same
    // menu items on large and small screens without the need to re-define them.
    import { menuItems } from '$lib/components/ui/Header.svelte';

    // A very simple function to close the expanded drawer menu when a button in
    // the menu is clicked.
    function onClickSidebarItem(): void {
        drawerStore.close();
    }
</script>

<Drawer>
    <div class="p-4 space-y-4 overflow-y-auto">
        <nav class="list-nav">
            <ul>
                {#each menuItems as item}
                    <a
                        href={item.href}
                        class="btn variant-soft-surface"
                        onclick={() => onClickSidebarItem()}
                    >
                        <span><item.icon /></span>
                        <span>{item.name}</span>
                    </a>
                {/each}
            </ul>
        </nav>
    </div>
</Drawer>
