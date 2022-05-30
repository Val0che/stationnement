<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Loader } from 'google-maps';
	import { MAPS_API_KEY } from '$lib/constants';
	import { browser } from '$app/env';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { coordinates } from '$lib/stores/coordinates';

	let mapLoader: Loader = null;
	$: state = 'idle';

	const handlePositionClick = () => {
		if (!browser) {
			return;
		}
		return new Promise(function (resolve, reject) {
			state = 'loading';
			navigator.geolocation.getCurrentPosition(
				(position) => {
					if (position) {
						coordinates.set({
							lat: position.coords.latitude,
							lng: position.coords.longitude
						});
						resolve(goto('/pannels'));
					}
					state = 'sucess';
				},
				(error) => {
					reject(`ERROR(${error.code}): ${error.message}`);
					state = 'error';
				}
			);
		});
	};

	let sub;
	onMount(async () => {
		mapLoader = new Loader(MAPS_API_KEY);
		mapLoader.load();
		if ('serviceWorker' in navigator) {
			// Service worker supported
			navigator.serviceWorker.register('/service-worker.js');
			const reg = await navigator.serviceWorker.ready;
			sub = await reg.pushManager.getSubscription();
			if (!sub) {
				// Fetch VAPID public key
				const res = await fetch('/api/vapidkeys');
				const data = await res.text();
				sub = await reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data
				});
			}
			console.log(sub);
		}
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
	{:else if state === 'error'}
		<p class="text-red">Error trying to get your geolocation.</p>
	{/if}
</section>
