import type { PageLoad } from './$types';
import hello_world from '$lib/contracts/hello_world';

export const load: PageLoad = async () => {
    const { result } = await hello_world.hello({
        to: 'SvelteKit Passkeys',
    });

    return {
        greeting: result,
    };
};
