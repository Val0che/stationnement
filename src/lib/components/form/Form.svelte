<script lang="ts">
	import type {
		SubmitEventDetail,
		SuccessEventDetail,
		ErrorEventDetail,
		CompleteEventDetail,
		FormEvents,
		CancelEventDetail,
		InvalidateEventDetail
	} from './types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { getSessionActionData } from './sessionActionData';
	import { HEADER_FORM_FETCH, HEADER_FORM_REDIRECT } from '$lib/constants';

	type Method = 'POST' | 'GET';
	type Enctype = 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

	interface $$Events {
		submit: CustomEvent<SubmitEventDetail>;
		invalidate: CustomEvent<InvalidateEventDetail>;
		success: CustomEvent<SuccessEventDetail>;
		error: CustomEvent<ErrorEventDetail>;
		complete: CustomEvent<CompleteEventDetail>;
		cancel: CustomEvent<CancelEventDetail>;
		input: InputEvent;
		change: InputEvent;
		reset: Event;
	}

	export let action: string = null;
	export let method: Method = 'POST';
	export let enctype: Enctype = 'application/x-www-form-urlencoded';
	export let novalidate = false;
	export let reloadPage = false;
	export let resetOnSuccess = true;
	let invalidateResource: string = null;
	export { invalidateResource as invalidate };
	export let preserveData = false;

	let formEl: HTMLFormElement = null;

	export const requestSubmit = () => {
		if (reloadPage) {
			formEl?.submit();
			return;
		}
		if (typeof formEl?.requestSubmit === 'function') {
			formEl?.requestSubmit();
		} else {
			const submitter = document.createElement('input');
			submitter.type = 'submit';
			submitter.hidden = true;
			formEl?.appendChild(submitter);
			submitter.click();
			formEl?.removeChild(submitter);
		}
	};

	const dispatch = createEventDispatcher<FormEvents>();
	const globalActionData = getSessionActionData();

	const isGet = method.toLowerCase() === 'get';

	let abortController: AbortController = null;

	const formDataToSearchParams = (formData: FormData) => {
		// Convert file objects to string
		const filteredData = Array.from(formData, ([key, value]) => [
			key,
			typeof value === 'string' ? value : value.name
		]);
		return new URLSearchParams(filteredData);
	};

	const handleGet = async (formData: FormData) => {
		const qs = formDataToSearchParams(formData).toString();
		return goto(`${formEl.action}?${qs}`);
	};

	const handlePost = async (formData: FormData) => {
		abortController?.abort();
		abortController = new AbortController();
		try {
			const { action } = formEl;
			const body =
				enctype === 'multipart/form-data' ? formData : formDataToSearchParams(formData);
			const res = await fetch(action, {
				method: 'POST',
				headers: {
					[HEADER_FORM_FETCH]: 'true',
					accept: 'application/json'
				},
				body,
				signal: abortController.signal
			});

			const redirectTo = res.headers.get(HEADER_FORM_REDIRECT);
			if (redirectTo) {
				return goto(redirectTo).then(() => {
					globalActionData.update((data) => {
						return {
							...(data || {}),
							[action]: undefined
						};
					});
				});
			}
			const resData = await res.json();

			globalActionData.update((data) => {
				return {
					...(data || {}),
					[action]: resData
				};
			});
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			if (resetOnSuccess) {
				formEl.reset();
			}
			if (invalidateResource) {
				dispatch('invalidate', { form: formEl });
				await invalidate(invalidateResource);
			}
			dispatch('success', { form: formEl });
			return;
		} catch (error) {
			if (error.name === 'AbortError') {
				return;
			}
			console.error(error);
			dispatch('error', { form: formEl, error });
			return;
		}
	};

	const handleSubmit = async (e: Event) => {
		const formData = new FormData(formEl);
		dispatch('submit', { form: formEl, event: e, formData });
		if (e.defaultPrevented) {
			dispatch('cancel', { form: formEl });
			return;
		}
		if (reloadPage) {
			return;
		}
		e.preventDefault();
		const submitFn = isGet ? handleGet : handlePost;
		await submitFn(formData);
		dispatch('complete', { form: formEl });
	};

	let actionAttribute = isGet ? action : null;

	onMount(() => {
		// Remove browser validation only if js works
		if (novalidate) {
			formEl.setAttribute('novalidate', '');
		}
		// Set the endpoint provided by the user as the form action only if js works
		if (!reloadPage) {
			actionAttribute = action;
			formEl.querySelector('input[name="_action"')?.remove();
		}

		return () => {
			if (!preserveData) {
				globalActionData.update((data) => {
					return {
						...(data || {}),
						[formEl.action]: undefined
					};
				});
			}
		};
	});
</script>

<form
	{method}
	action={actionAttribute}
	{enctype}
	on:submit={handleSubmit}
	on:input
	on:change
	on:reset
	bind:this={formEl}
	{...$$restProps}
>
	{#if method === 'POST'}
		<input type="hidden" name="_action" value={action || $page.url.toString()} />
	{/if}
	<slot />
</form>
