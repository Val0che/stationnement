import type { CookieSerializeOptions } from 'cookie';

// Auth
export enum Cookies {
	address = 'smtl-addresses'
}

export const BASE_COOKIE_OPTIONS: CookieSerializeOptions = {
	path: '/',
	httpOnly: true,
	secure: true,
	sameSite: 'lax'
};

export const firebaseConfig = {
	apiKey: 'AIzaSyCXfBvbhKDsb3r_6L142RMZ4Z6-B3JQ05s',
	authDomain: 'stationnement-mtl.firebaseapp.com',
	projectId: 'stationnement-mtl',
	storageBucket: 'stationnement-mtl.appspot.com',
	messagingSenderId: '233667917442',
	appId: '1:233667917442:web:2c8f27458a275e7be1a69b',
	measurementId: 'G-WBJVE2CLJ2'
};
