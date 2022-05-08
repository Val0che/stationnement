<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowDown from './svg/ArrowDown.svelte';

	let showInstallMessage = false;
	const isIos = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /iphone|ipad|ipod/.test(userAgent);
	};

	const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

	onMount(() => {
		if (isIos() && !isInStandaloneMode()) {
			showInstallMessage = true;
		}
	});
</script>

<div
	class="fixed bottom-8 left-0 w-full text-purple-500 flex flex-col justify-center items-center space-y-2"
	class:hidden={!showInstallMessage}
>
	<div class="rounded-xl bg-purple-500 w-full p-4 max-w-[95%] mx-auto">
		<p class="text-md text-white text-center">
			Please click on the button below and select "Add to Homescreen".
		</p>
	</div>
	<ArrowDown />
</div>
