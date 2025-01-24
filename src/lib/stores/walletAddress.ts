import { writable, type Writable } from "svelte/store";

export const walletAddress: Writable<string> = writable();
