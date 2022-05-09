import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '$lib/constants';
import type { RequestHandler } from '@sveltejs/kit';
import { makeCookies } from '$lib/api/makeCookies';

export const post: RequestHandler<Record<string, string>> = async (event) => {
	const { request } = event;

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	try {
		const formData = await request.formData();

		const values: DBData = {
			name: formData.get('street-name'),
			slug: formData.get('slug'),
			day_left: formData.get('day-left'),
			day_right: formData.get('day-right'),
			left_start_hour: formData.get('left-start-hour'),
			left_end_hour: formData.get('left-end-hour'),
			right_start_hour: formData.get('right-start-hour'),
			right_end_hour: formData.get('right-end-hour')
		};

		console.log(values);

		if (values) {
			try {
				const docRef = await addDoc(collection(db, 'streets'), {
					name: values.name,
					day_left: values.day_left,
					day_right: values.day_right,
					left_start_hour: values.left_start_hour,
					left_end_hour: values.left_end_hour,
					right_start_hour: values.right_start_hour,
					right_end_hour: values.right_end_hour,
					slug: values.slug
				});
				console.log('Document written with ID: ', docRef.id);

				const cookies = makeCookies(values.slug);
				return {
					status: 200,
					headers: {
						'set-cookie': cookies
					},
					body: {
						success: true,
						message: `Thank you for you submission!`
					}
				};
			} catch (e) {
				console.error('Error adding document: ', e);
			}
		}
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: {
				message: error.message
			}
		};
	}
};
