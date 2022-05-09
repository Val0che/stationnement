<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '$lib/css/main.css';
	import IOsPopup from '$lib/components/iOSPopup.svelte';
</script>

<Header />

<main>
	<slot />
	<IOsPopup />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
