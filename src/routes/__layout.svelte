<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '$lib/css/main.css';
	import IOsPopup from '$lib/components/iOSPopup.svelte';
	import { onMount } from 'svelte';

	let sub: PushSubscription;

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			// Service worker supported
			navigator.serviceWorker.register('/service-worker.js');
			const reg = await navigator.serviceWorker.ready;
			sub = await reg.pushManager.getSubscription();
			if (!sub) {
				const res = await fetch('/api/vapidkeys');
				const data = await res.text();
				console.log(res);
				sub = await reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: data
				});
			}
			console.log(sub);
		}

		const status = await Notification.requestPermission();
		if (status !== 'granted')
			alert('Please allow notifications to make sure that the application works.');
	});
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
