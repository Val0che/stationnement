<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			console.log(position);
		});
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="text-200">WELCOME</h1>
</section>
