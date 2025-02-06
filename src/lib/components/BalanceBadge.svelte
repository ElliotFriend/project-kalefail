<script lang="ts">
    let { asset, balance }: { asset: string; balance: number } = $props();

    let className = $state(`badge variant-filled-${asset === 'KALE' ? 'success' : 'primary'}`);
</script>

<span class={className}>{balance === 0 ? balance : balance.toFixed(7)} {asset}</span>
