<!--
 @component
 This `PageContent` component is just an HTML component that helps us set up
 some responsiveness, containers, etc. Customize this as you want, it's simply a
 lot of Tailwind CSS class names and such.
-->

<div class="flex-auto w-full h-full flex overflow-hidden">
    <!-- aside goes here if we want a sidebar -->
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
