<script lang="ts">
    import { PUBLIC_STELLAR_NETWORK } from '$env/static/public';
    import trading_post from '$lib/contracts/trading_post';
</script>

<footer class="flex-none bg-surface-100-800-token shadow-xl p-4">
    <div
        class="flex flex-col md:flex-row md:space-y-0 justify-around align-center mx-auto"
    >
        <div class="hidden md:grid space-y-1">
            <h6 class="h6">The KALE Project</h6>
            <ul>
                <li>
                    <a class="anchor" target="_blank" href="https://kalefarm.xyz/"> Farm KALE </a>
                </li>
                <li>
                    <a class="anchor" target="_blank" href="https://kalepail.com/kale">
                        Read Lore
                    </a>
                </li>
            </ul>
        </div>
        <div class="md:grid grid-cols-1">
            <div class="space-y-1">
                <h6 class="h6">The KaleFail Project</h6>
                <ul>
                    <li>
                        <a
                            class="anchor"
                            target="_blank"
                            href="https://github.com/elliotfriend/project-kalefail"
                        >
                            View Source Code
                        </a>
                    </li>
                    <li class="hidden md:grid">
                        <a
                            class="anchor"
                            target="_blank"
                            href={`https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${trading_post.options.contractId}`}
                        >
                            View Contract
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="hidden md:grid grid-cols-1">
            <div class="space-y-1">
                <h6 class="h6">More Info</h6>
                <ul>
                    <li>
                        <a class="anchor" target="_blank" href="https://developers.stellar.org">
                            Developer Documentation
                        </a>
                    </li>
                    <li>
                        <a
                            class="anchor"
                            target="_blank"
                            href="https://github.com/kalepail/passkey-kit"
                        >
                            Passkey Kit
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</footer>
