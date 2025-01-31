<div class="flex-auto w-full h-full flex overflow-hidden">
    <div
        id="page"
        class="scroll-smooth flex-1 overflow-x-hidden flex flex-col"
        style="scrollbar-gutter: auto;"
    >
        <main id="page-content" class="flex-auto">
            <div class="flex items-start gap-10 relative p-10">
                <div class="mx-auto w-full max-w-4xl space-y-4">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</div>
