import cookie from 'cookie';
import { BASE_COOKIE_OPTIONS, Cookies } from '$lib/constants';

export const makeCookies = (data): string => {
	if (!data) {
		return;
	}
	const addressCookie = cookie.serialize(Cookies.address, data, {
		...BASE_COOKIE_OPTIONS,
		expires: new Date(new Date().setFullYear(new Date().getFullYear() + 99))
	});

	return addressCookie;
};
