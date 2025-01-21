<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-5">
        <h1 class="h1">{data.greeting.join(', ')}!</h1>
        <h2 class="h2">Let's build a dapp!!</h2>
        <p>Start by exploring:</p>
        <ul>
            <li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
            <li><code class="code">/src/app.postcss</code> - app wide css</li>
            <li>
                <code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
            </li>
            <li>
                <code class="code">/src/routes/+page.ts</code> - a
                <a class="anchor" href="https://svelte.dev/docs/kit/load#Page-data" target="_blank"
                    >load function</a
                >
                that is run when this page is requested, returning its data to this page's
                <code class="code">data</code> prop
            </li>
        </ul>
    </div>
</div>
