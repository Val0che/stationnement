<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from 'google-maps';
	import { MAPS_API_KEY } from '$lib/constants';
	import { browser } from '$app/env';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	import Form from '$lib/components/form/Form.svelte';
	import { getActionData } from '$lib/components/form';

	let mapLoader: Loader = null;
	let latLng: google.maps.LatLngLiteral = {
		lat: null,
		lng: null
	};

	$: state = 'idle';

	$: console.log(state);
	const action = '/api/testDB.json';
	const actionData = getActionData(action);

	const handlePositionClick = () => {
		if (!browser) {
			return;
		}
		return new Promise(function (resolve, reject) {
			state = 'loading';
			navigator.geolocation.getCurrentPosition(
				(position) => {
					if (position) {
						latLng = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};

						resolve('success');
					}
					state = 'sucess';
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

	{#if state === 'loading'}
		<div transition:fly={{ y: 20, duration: 100 }}>
			<Spinner class="text-purple-800" />
		</div>
	{:else if state === 'sucess'}
		<h1 class="text-2xl text-center mt-10">
			LatLng: {latLng.lat} / {latLng.lng}
		</h1>
		<Form {action}>
			<input type="hidden" name="lat" value={latLng.lat} />
			<input type="hidden" name="lng" value={latLng.lng} />
			<button
				class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
				type="submit">Find your panel</button
			>
		</Form>
	{/if}

	{#if $actionData}
		{@const panels = $actionData.response.documents}
		{#each panels as panel (panel._id)}
			<button class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8">
				{panel.DESCRIPTION_RPA}
			</button>
		{/each}
	{/if}
</section>
