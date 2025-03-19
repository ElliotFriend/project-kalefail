<script lang="ts">
    let { title, subtitle, showDivider = true }: { title: string; subtitle: string; showDivider?: boolean } = $props();
</script>

<div class="space-y-4">
    <h1 class="h1">{title}</h1>
    <p>{subtitle}</p>
</div>

{#if showDivider}
    <hr />
{/if}
