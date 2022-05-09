import cookie from 'cookie';
import { BASE_COOKIE_OPTIONS, Cookies } from '$lib/constants';

export const removeCookies = () => {
	const cookieOptions = {
		...BASE_COOKIE_OPTIONS,
		expires: new Date(1),
		maxAge: undefined
	};

	const addressCookie = cookie.serialize(Cookies.address, '', cookieOptions);

	return addressCookie;
};
