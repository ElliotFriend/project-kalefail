import type { PageLoad } from './$types';
import kale_salad from '$lib/contracts/kale_salad';

export const load: PageLoad = async () => {

    return {
        instance: true,
    };
}
