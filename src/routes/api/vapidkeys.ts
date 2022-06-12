const webPush = require('web-push');

export async function get() {
	webPush.setVapidDetails(
		'http://localhost:3000',
		process.env.VAPID_PUBLIC_KEY,
		process.env.VAPID_PRIVATE_KEY
	);

	return {
		status: 200,
		body: process.env.VAPID_PUBLIC_KEY
	};
}
