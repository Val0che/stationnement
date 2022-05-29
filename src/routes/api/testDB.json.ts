import { DB_API_KEY } from '$lib/constants';
import haversine from 'haversine-distance';

const getFirstFourNumbers = (string: string) => {
	if (string.includes('-')) {
		return string.slice(0, 7);
	}
	return string.slice(0, 6);
};

const formatPanels = (panels: Panel[], latLng) => {
	return panels
		.map((panel) => {
			const panelLatLng = { lat: Number(panel.Latitude), lng: Number(panel.Longitude) };
			const currentLatLng = { lat: latLng.lat, lng: latLng.lng };
			return { ...panel, distance: haversine(panelLatLng, currentLatLng) };
		})
		.sort((a, b) => a.distance - b.distance);
};

export const post = async (event) => {
	const { request } = event;

	try {
		const formData = await request.formData();

		const values = {
			lat: getFirstFourNumbers(formData.get('lat')),
			lng: getFirstFourNumbers(formData.get('lng'))
		};

		if (values.lat || values.lng) {
			const data = JSON.stringify({
				collection: 'pannels',
				database: 'pannelsdb',
				dataSource: 'Cluster0',
				filter: {
					Latitude: { $regex: `^${values.lat}` },
					Longitude: { $regex: `^${values.lng}` },
					DESCRIPTION_REP: 'Réel',
					DESCRIPTION_RPA: { $regex: '\\\\P', $not: { $regex: 'S3R' } }
				}
			});

			const res = await fetch(
				'https://data.mongodb-api.com/app/data-ddgtq/endpoint/data/beta/action/find',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Request-Headers': '*',
						'api-key': DB_API_KEY
					},
					body: data
				}
			);

			if (res.status !== 200) {
				throw new Error(res.statusText);
			}

			const response = await res.json();

			const formattedResponse = formatPanels(response?.documents, values);
			return {
				status: res.errors?.length ? 400 : 200,
				body: formattedResponse
			};
		}
	} catch (error) {
		// Properly pass down unexpected errors
		return {
			status: error.status || 500,
			errors: [error.message]
		};
	}
};
