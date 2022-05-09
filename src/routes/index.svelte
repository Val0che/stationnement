<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from 'google-maps';
	import FormHours from '$lib/components/FormHours.svelte';
	import { MAPS_API_KEY } from '$lib/constants';
	import { browser } from '$app/env';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	import { getFirestore, doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import { firebaseConfig } from '$lib/constants';
	import { slugify } from '$lib/utils';

	let loading = false;
	let streetName: string = null;
	let slug: string = null;
	let mapLoader: Loader = null;
	let geocoder: google.maps.Geocoder = null;
	let streetValues: DBData = null;

	const handlePositionClick = () => {
		if (!browser) {
			return;
		}
		loading = true;
		navigator.geolocation.getCurrentPosition((position) => {
			const latlng = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			geocoder
				.geocode({ location: latlng })
				.then(async (response) => {
					streetName = response.results[0].address_components[1].long_name;
					slug = slugify(streetName);
					const app = initializeApp(firebaseConfig);
					const db = getFirestore(app);
					const q = query(collection(db, 'streets'), where('slug', '==', slug));
					const querySnapshot = await getDocs(q);

					querySnapshot.forEach((doc) => {
						// doc.data() is never undefined for query doc snapshots
						if (doc) {
							streetValues = doc.data() as DBData;
							console.log(streetValues);
						}
					});
				})
				.catch((e) => window.alert('Geocoder failed due to: ' + e));

			loading = false;
		});
	};

	onMount(() => {
		console.log(mapLoader);
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

	{#if loading}
		<div transition:fly={{ y: 20, duration: 100 }}>
			<Spinner class="text-purple-800" />
		</div>
	{:else if streetValues}
		<h1 class="text-3xl text-center">
			I already know this place! <br /> Please select the side you're parked on.
		</h1>

		<button
			class="w-full bg-purple-500 text-white px-4 py-4 rounded-2xl uppercase text-xl mt-8 grid grid-cols-5 items-center"
		>
			<p class="text-xl col-span-2">Left Side</p>
			<p class="text-xl col-span-3">
				{streetValues.day_left} - From: {streetValues.left_start_hour} to: {streetValues.left_end_hour}
			</p>
		</button>

		<button
			class="w-full bg-purple-500 text-white px-4 py-4 rounded-2xl uppercase text-xl mt-8 grid grid-cols-5 items-center"
		>
			<p class="text-xl col-span-2">Right Side</p>
			<p class="text-xl col-span-3">
				{streetValues.day_right} - From: {streetValues.right_start_hour} to: {streetValues.right_end_hour}
			</p>
		</button>
	{:else}
		<div class="space-y-4 text-center text-lg mt-12" transition:fly={{ y: 20, duration: 100 }}>
			<p class="text-xl">Street name: {streetName}</p>
		</div>
		<h1 class="text-xl text-center mt-8">Set the cleaning hours of the street</h1>
		<FormHours {streetName} {slug} />
	{/if}
</section>
