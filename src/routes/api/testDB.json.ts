import { DB_API_KEY } from '$lib/constants';

export const post = async (event) => {
	const data = JSON.stringify({
		collection: 'pannels',
		database: 'pannelsdb',
		dataSource: 'Cluster0'
	});

	try {
		const res = await fetch(
			'https://data.mongodb-api.com/app/data-ddgtq/endpoint/data/beta/action/findOne',
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

		return {
			status: res.errors?.length ? 400 : 200,
			body: {
				response
			}
		};
	} catch (error) {
		// Properly pass down unexpected errors
		return {
			status: error.status || 500,
			errors: [error.message]
		};
	}
};
