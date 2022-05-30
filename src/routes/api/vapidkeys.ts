const webPush = requirex('web-push');

webPush.setVapidDetails(
	'http://localhost:3000',
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
);

module.exports = (_, res) => {
	res.send(process.env.VAPID_PUBLIC_KEY);
};
