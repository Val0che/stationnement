import { page } from '$app/stores';
import { derived, get } from 'svelte/store';
import { getSessionActionData } from './sessionActionData';

export const getActionData = (action: string) => {
	const pageUrl = get(page).url;
	const actionUrl = action ? new URL(action, pageUrl.origin).toString() : pageUrl.toString();
	return derived(getSessionActionData(), ($actionData) => {
		return $actionData?.[actionUrl];
	});
};
