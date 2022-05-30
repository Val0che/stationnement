import { writable } from 'svelte/store';

export const coordinates = writable(<google.maps.LatLngLiteral>{
	lat: null,
	lng: null
});
