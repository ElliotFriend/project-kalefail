<script lang="ts">
    import { getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
    const drawerStore = getDrawerStore();

    import { menuItems } from '$lib/components/ui/Header.svelte';
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
