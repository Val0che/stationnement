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
	import Geoloc from '$lib/components/svg/Geoloc.svelte';
	import Card from '$lib/components/ui/Card.svelte';

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

<section class="text-center">
	<div class="relative z-0 bg-purple-light h-full py-32 text-white">
		<h3 class="text-sm">Hi there! Welcome to</h3>
		<h1 class="font-extrabold mt-4 text-3xl">MTL Parking</h1>
	</div>
	<div class="relative z-1 bg-purple-dark h-full text-white py-12 px-4">
		<div class="w-full flex flex-nowrap gap-x-4 overflow-x-auto">
			<Card title="Step 1" content="Set your position using your geolocation" />
			<Card title="Step 2" content="Enter the cleaning hours of both sides of your street" />
			<Card title="Step 3" content="Select the side that you're parked on." />
			<Card
				title="Step 4"
				content="Receive a push message 24h and 2h before to remind you to move your car."
			/>
		</div>
		<button class="bg-purple rounded-md flex h-14 mt-12 w-full items-center overflow-hidden">
			<div class="p-2 h-full w-14 flex items-center justify-center text-white bg-purple-light">
				<Geoloc />
			</div>
			<p class="px-4 text-xl uppercase">Set your position</p>
		</button>
	</div>
</section>
