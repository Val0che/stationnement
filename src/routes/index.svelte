<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	let coordinates: GeolocationPosition;

	onMount(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			coordinates = position;
		});
	});
</script>

<svelte:head>
	<title>Stationnement MTL</title>
	<meta name="description" content="Bouge ton char avant de prendre un ticket." />
</svelte:head>

<section>
	<h1 class="text-3xl text-center">WELCOME</h1>
</section>
