<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from '@googlemaps/js-api-loader';
	import FormHours from '$lib/components/FormHours.svelte';
	import { MAPS_API_KEY } from '$lib/constants';

	let streetName = '';

	const loader = new Loader({
		apiKey: MAPS_API_KEY,
		version: 'weekly'
	});

	const handlePositionClick = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			const latlng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			loader.load().then((google) => {
				const geocoder = new google.maps.Geocoder();
				geocoder.geocode({ location: latlng }).then((response) => {
					console.log(response.results);
					streetName = response.results[0].address_components[1].long_name;
				});
			});
		});
	};
</script>

<svelte:head>
	<title>Stationnement MTL</title>
	<meta name="description" content="Bouge ton char avant de prendre un ticket." />
</svelte:head>

<section class="text-center">
	<h1 class="text-3xl text-center">PARKING</h1>
	<button
		class="bg-purple-500 text-white px-12 py-4 rounded-2xl uppercase text-xl mt-8"
		on:click={handlePositionClick}>Set my position</button
	>
	{#if streetName}
		<div class="space-y-4 text-center text-lg mt-12" transition:fly={{ y: 20, duration: 100 }}>
			<p>Street address: {streetName}</p>
		</div>
		<h1 class="text-3xl text-center">Set the cleaning hours of the street</h1>
	{/if}
	<FormHours {streetName} />
</section>
