<script lang="ts">
	export let streetName = '';

	let formEl: HTMLFormElement = null;

	let leftSide = {
		day: '',
		hourStart: '',
		hourEnd: ''
	};
	let rightSide = {
		day: '',
		hourStart: '',
		hourEnd: ''
	};

	const handleSubmit = async (e: Event) => {
		const formData = new FormData(formEl);
		const body = formData;
		const res = await fetch('/api/saveData.json', {
			method: 'POST',
			headers: {
				'x-form-fetch': 'true',
				accept: 'application/json'
			},
			body
		});
	};
</script>

<form bind:this={formEl}>
	<h3 class="text-xl w-full mt-10">Left side</h3>
	<div class="w-full px-10 mt-4">
		<label for="day-left">Day:</label>
		<select
			id="day-left"
			name="day-left"
			class="border-slate-700 border-2 pr-10 py-1 ml-8"
			value={leftSide.day || null}
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
		<label for="left-start-hour">Start time:</label>
		<input
			class="border-slate-700 border-2 pl-2 py-1 ml-8"
			type="time"
			id="left-start-hour"
			name="left-start-hour"
			step="1800"
			required
			value={leftSide.hourStart || null}
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
			value={leftSide.hourEnd || null}
		/>
	</div>
	<h3 class="text-xl w-full mt-10">Right side</h3>
	<div class="w-full px-10 mt-4">
		<label for="day-right">Day:</label>
		<select
			name="day-right"
			class="border-slate-700 border-2 pr-10 py-1 ml-8"
			value={rightSide.day || null}
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
			value={rightSide.hourStart || null}
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
			value={rightSide.hourEnd || null}
		/>
	</div>
	<input type="hidden" value={streetName} name="street-name" id="street-name" />
	<button
		class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
		type="submit"
		on:click|preventDefault={handleSubmit}>Save</button
	>
</form>
