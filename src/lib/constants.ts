import type { CookieSerializeOptions } from 'cookie';

export const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

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
	apiKey: FIREBASE_API_KEY,
	authDomain: 'stationnement-mtl.firebaseapp.com',
	projectId: 'stationnement-mtl',
	storageBucket: 'stationnement-mtl.appspot.com',
	messagingSenderId: '233667917442',
	appId: '1:233667917442:web:2c8f27458a275e7be1a69b',
	measurementId: 'G-WBJVE2CLJ2'
};
