<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '$lib/css/main.css';
	import IOsPopup from '$lib/components/iOSPopup.svelte';
</script>

<Header />

<main>
	<slot />
</main>
