<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from 'google-maps';
	import { MAPS_API_KEY } from '$lib/constants';
	import { browser } from '$app/env';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	import Form from '$lib/components/form/Form.svelte';
	import { getActionData } from '$lib/components/form';

	let loading = false;
	let streetName: string = null;
	let mapLoader: Loader = null;
	let latLng: google.maps.LatLngLiteral = {
		lat: null,
		lng: null
	};

	const action = '/api/testDB.json';
	const actionData = getActionData(action);

	const handlePositionClick = () => {
		if (!browser) {
			return;
		}
		return new Promise(function (resolve, reject) {
			loading = true;
			navigator.geolocation.getCurrentPosition(
				(position) => {
					if (position) {
						latLng = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};

						resolve('success');
					}
					loading = false;
				},
				(error) => {
					reject(`ERROR(${error.code}): ${error.message}`);
				}
			);
		});
	};

	onMount(() => {
		mapLoader = new Loader(MAPS_API_KEY);
		mapLoader.load();
	});
</script>

<svelte:head>
	<title>Stationnement MTL</title>
	<meta name="description" content="Bouge ton char avant de prendre un ticket." />
</svelte:head>

<section class="max-w-md mx-auto text-center">
	<h1 class="text-3xl text-center">PARKING</h1>
	<button
		class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
		on:click={handlePositionClick}>Set my position</button
	>

	{#if loading && !streetName}
		<div transition:fly={{ y: 20, duration: 100 }}>
			<Spinner class="text-purple-800" />
		</div>
	{:else}
		<h1 class="text-3xl text-center">
			Your street: {streetName}
		</h1>
	{/if}

	<Form {action}>
		<input type="hidden" name="lat" value={latLng.lat || null} />
		<input type="hidden" name="lng" value={latLng.lng || null} />
		<button
			class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
			type="submit">TEST DB</button
		>
	</Form>

	{#if $actionData}
		{@const panels = $actionData.response.documents}
		{#each panels as panel (panel._id)}
			<button class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8">
				{panel.DESCRIPTION_RPA}
			</button>
		{/each}
	{/if}
</section>
