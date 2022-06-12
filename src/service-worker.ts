let CACHE_NAME = 'cache-' + Date.now();

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log(cache);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		// Loop through the cache
		caches.keys().then((keys) => {
			// We must return a promise so it gets awaited
			return Promise.all(
				keys.map((k) => {
					// If the key doesn't match the name of the current cache, delete it
					if (k !== CACHE_NAME) return caches.delete(k);
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	// We only want to send /offline.html when the user is navigating pages,
	// not when they're requesting something else like CSS files or API requests.
	if (event.request.mode !== 'navigate') return;

	event.respondWith(
		fetch(event.request).catch(() => {
			return caches.open(CACHE_NAME).then((cache) => {
				return cache.match('offline.html');
			});
		})
	);
});

self.addEventListener('push', (event) => {
	// Double check the push event
	if (event.data.text() === 'new-issue') {
		event.waitUntil(
			self.registration.showNotification('New issues', {
				body: 'One or more tracked repositories have new issues or pull requests.'
			})
		);
	}
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(clients.openWindow('/'));
});
