<script lang="ts">
	import Form from '$lib/components/form/Form.svelte';
	import { getActionData } from '$lib/components/form';
	import { coordinates } from '$lib/stores/coordinates';

	const action = '/api/testDB.json';
	const actionData = getActionData(action);
</script>

<section class="max-w-md mx-auto text-center">
	<Form {action}>
		<input type="hidden" name="lat" value={$coordinates.lat} />
		<input type="hidden" name="lng" value={$coordinates.lng} />
		<button
			class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
			type="submit">Find your panel</button
		>
	</Form>
	{#if $actionData}
		{@const panels = $actionData}
		{#each panels as panel (panel._id)}
			<button class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8">
				{panel.DESCRIPTION_RPA}
			</button>
		{/each}
	{/if}
</section>
