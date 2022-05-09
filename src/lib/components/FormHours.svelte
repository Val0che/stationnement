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
	import DefaultForm from './ui/DefaultForm.svelte';
	import Spinner from './ui/Spinner.svelte';

	export let streetName = '';
	export let slug = '';
</script>

<DefaultForm
	class="flex h-full flex-col p-2"
	action="/api/saveData.json"
	let:state
	let:errors
	let:message
	let:values
	novalidate
>
	<h3 class="text-xl w-full mt-10">Left side</h3>
	<div class="w-full px-10 mt-4">
		<label for="day-left">Day:</label>
		<select
			id="day-left"
			name="day-left"
			class="border-slate-700 border-2 pr-10 py-1 ml-8"
			value={values.day_left || null}
		>
			<option>Monday</option>
			<option>Tuesday</option>
			<option>Wednesday</option>
			<option>Thursday</option>
			<option>Friday</option>
			<option>Saturday</option>
			<option>Sunday</option>
		</select>
	</div>
	<div class="w-full px-10 mt-8">
		<label for="left-start-hour">Start time:</label>
		<input
			class="border-slate-700 border-2 pl-2 py-1 ml-8"
			type="time"
			id="left-start-hour"
			name="left-start-hour"
			step="1800"
			required
			value={values.left_start_hour || null}
		/>
	</div>
	<div class="w-full px-10 mt-8">
		<label for="left-end-hour">End time:</label>
		<input
			class="border-slate-700 border-2 pl-2 py-1 ml-8"
			type="time"
			id="left-end-hour"
			name="left-end-hour"
			step="1800"
			required
			value={values.left_end_hour || null}
		/>
	</div>
	<h3 class="text-xl w-full mt-10">Right side</h3>
	<div class="w-full px-10 mt-4">
		<label for="day-right">Day:</label>
		<select
			name="day-right"
			class="border-slate-700 border-2 pr-10 py-1 ml-8"
			value={values.day_right || null}
		>
			<option selected>Monday</option>
			<option>Tuesday</option>
			<option>Wednesday</option>
			<option>Thursday</option>
			<option>Friday</option>
			<option>Saturday</option>
			<option>Sunday</option>
		</select>
	</div>
	<div class="w-full px-10 mt-8">
		<label for="right-start-hour">Start time:</label>
		<input
			class="border-slate-700 border-2 pl-2 py-1 ml-8"
			type="time"
			id="right-start-hour"
			name="right-start-hour"
			step="1800"
			required
			value={values.right_start_hour || null}
		/>
	</div>
	<div class="w-full px-10 mt-8">
		<label for="right-end-hour">End time:</label>
		<input
			class="border-slate-700 border-2 pl-2 py-1 ml-8"
			type="time"
			id="right-end-hour"
			name="right-end-hour"
			step="1800"
			required
			value={values.right_end_hour || null}
		/>
	</div>
	<input type="hidden" value={streetName} name="street-name" id="street-name" />
	<input type="hidden" value={slug} name="slug" id="slug" />
	<button
		type="submit"
		class="group mt-8 flex w-full items-center rounded-10 bg-black p-4 rounded-full"
	>
		<p class="flex w-full items-center justify-between text-white">
			<span>{state === 'submitting' ? 'Submitting' : 'Submit'}</span>
			{#if state === 'submitting'}
				<Spinner class="text-purple-800" size="40" />
			{:else}
				<span class="text-80 leading-0 transition-transformgroup -hover:translate-x-4">&#8594;</span
				>
			{/if}
		</p>
	</button>
</DefaultForm>
