import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { session } from '$app/stores';
import { browser } from '$app/env';

let store: Writable<SessionActionData>;

export const getSessionActionData = () => {
	if (!store || !browser) {
		store = writable(get(session)?.actionData);
	}
	return store;
};
