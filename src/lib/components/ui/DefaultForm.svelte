<script lang="ts" context="module">
	import type { Readable } from 'svelte/store';

	type FormState = 'idle' | 'submitting' | 'success' | 'error';

	export interface DefaultFormContext {
		state: Readable<FormState>;
		values: Readable<ActionData['values']>;
		errors: Readable<ActionData['errors']>;
	}
</script>

<script lang="ts">
	import type { ErrorEventDetail, SubmitEventDetail } from '$lib/components/form';
	import { setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import machine from 'svelte-fsm';
	import { Form, getActionData } from '$lib/components/form';

	export let action: string = null;
	export let resetDelay = 10000;
	export let novalidate = false;
	let classes = '';
	export { classes as class };

	const actionData = getActionData(action);

	const initialState = () => {
		if ($actionData?.success) {
			return 'success';
		}
		if ($actionData?.errors) {
			return 'error';
		}
		return 'idle';
	};

	const state = machine(initialState(), {
		idle: {
			submit: 'submitting'
		},
		submitting: {
			_enter({ args }) {
				const event: CustomEvent<SubmitEventDetail> = args[0];
				const { form } = event?.detail || {};
				const { event: e } = event?.detail || {};
				checkValidity(form);
				if (Object.keys($errors).length !== 0) {
					e.preventDefault();
					this.error();
				}
			},
			success: 'success',
			error: 'error'
		},
		success: {
			_enter() {
				this.reset.debounce(resetDelay);
			},
			reset: 'idle',
			input: 'idle',
			submit: 'submitting'
		},
		error: {
			_enter({ args }) {
				const event: CustomEvent<ErrorEventDetail> = args[0];
				const { form } = event?.detail || {};
				if (!form) {
					return;
				}
				// Remove error keys that don't correspond to a form field name
				const { elements } = form;
				_errors.update((errors) => {
					return Object.fromEntries(
						Object.keys(errors)
							.filter((key) => !!elements[key])
							.map((key) => [key, errors[key]])
					);
				});
			},
			input(e: Event) {
				const input = e.target as HTMLInputElement;
				_errors.update((errors) => {
					delete errors[input.name];
					return errors;
				});
				if (Object.keys($errors).length > 0) {
					return 'error';
				}
				return 'idle';
			},
			submit(e: CustomEvent<SubmitEventDetail>) {
				const { event } = e.detail;
				event.preventDefault();
			}
		}
	});

	const onSubmit = (e: CustomEvent<SubmitEventDetail>) => {
		state.submit(e);
	};

	const _errors = writable($actionData?.errors || {});

	actionData.subscribe((data) => {
		_errors.set(data?.errors || {});
	});

	const values = derived(actionData, (data) => data?.values || {});
	const errors = derived(_errors, (e) => e);

	setContext<DefaultFormContext>('form', {
		state,
		values,
		errors
	});

	const checkValidity = (form: HTMLFormElement) => {
		const fields = form.elements;

		Array.from(fields).forEach((field: HTMLInputElement) => {
			if (
				field.nodeName === 'INPUT' ||
				field.nodeName === 'SELECT' ||
				field.nodeName === 'TEXTAREA'
			) {
				const name = field.name;
				field.setCustomValidity('');
				field.removeAttribute('aria-describedby');

				// Handle wrong format field
				if (!field.checkValidity()) {
					_errors.set({ [name]: true });
					field.setAttribute('aria-describedby', `${field.name}Error`);
				}
			}
		});
	};
</script>

<Form
	{action}
	method="POST"
	class={classes}
	{novalidate}
	on:submit={onSubmit}
	on:success={state.success}
	on:error={state.error}
	on:input={state.input}
	on:change={state.input}
>
	<slot values={$values} errors={$errors} state={$state} message={$actionData?.message} />
</Form>
