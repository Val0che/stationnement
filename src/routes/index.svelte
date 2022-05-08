<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	let coordinates: GeolocationPosition;
	let displayPrompt = false;
	let defferedPrompt;

	const handlePrompt = () => {
		defferedPrompt.prompt();

		defferedPrompt.userChoice.then((choice) => {
			if (choice.outcome === 'accepted') {
				console.log('user accepted the prompt');
			}
			defferedPrompt = null;
		});
	};

	onMount(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			coordinates = position;
		});

		window.addEventListener('beforeinstallprompt', (event) => {
			event.preventDefault();
			defferedPrompt = event;
			displayPrompt = true;
			console.log(event);
		});
	});
</script>

<svelte:head>
	<title>Stationnement MTL</title>
	<meta name="description" content="Bouge ton char avant de prendre un ticket." />
</svelte:head>

<section>
	<h1 class="text-200">WELCOME</h1>
	<button on:click={handlePrompt} class="rounded-xl text-lg py-2 px-8 bg-cyan-800 text-white">
		Install App
	</button>
</section>
