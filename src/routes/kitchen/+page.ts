import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    let response = await fetch('/api/kitchen');
    if (response.ok) {
        let returnObj = await response.json();
        return {
            kitchen: returnObj,
        };
    }
};
