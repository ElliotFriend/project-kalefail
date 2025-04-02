import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/api/kitchen');
    if (response.ok) {
        const returnObj = await response.json();
        return {
            kitchen: returnObj,
        };
    }
};
