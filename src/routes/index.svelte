<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from 'google-maps';
	import { MAPS_API_KEY } from '$lib/constants';
	import { browser } from '$app/env';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	import { slugify } from '$lib/utils';

	let loading = false;
	let streetName: string = null;
	let mapLoader: Loader = null;
	let geocoder: google.maps.Geocoder = null;
	let slug: string = null;

	const handlePositionClick = () => {
		if (!browser) {
			return;
		}
		loading = true;
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition((position) => {
				const latlng = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				geocoder.geocode({ location: latlng }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						streetName = results[0].address_components[1].long_name;
						slug = slugify(streetName);
						resolve(results);
					} else {
						reject(status);
						console.log('Geocode was not successful for the following reason: ' + status);
					}
					loading = false;
				});
			});
		});
	};

	const handlePost = async () => {
		try {
			const res = await fetch('/api/testDB.json', {
				method: 'POST',
				headers: {
					'x-form-fetch': 'true',
					accept: 'application/json'
				}
			});

			const data = await res.json();

			console.log(data);

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return;
		} catch (error) {
			console.error(error);
			return;
		}
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		await handlePost();
	};

	onMount(() => {
		console.log('mounted');
		mapLoader = new Loader(MAPS_API_KEY);
		mapLoader.load().then((google) => {
			geocoder = new google.maps.Geocoder();
		});
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

	<form on:submit={handleSubmit}>
		<button
			class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
			type="submit">TEST DB</button
		>
	</form>
</section>
