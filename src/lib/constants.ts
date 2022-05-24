import type { CookieSerializeOptions } from 'cookie';

export const MAPS_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
export const DB_API_KEY = import.meta.env.VITE_MONGO_API_KEY;
export const HEADER_FORM_REDIRECT = 'x-form-redirect';
export const HEADER_FORM_FETCH = 'x-form-fetch';
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
