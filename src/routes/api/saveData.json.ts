import { getFirestore } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '$lib/constants';
import { slugify } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import { makeCookies } from '$lib/api/makeCookies';

interface DbData {
	streetName: FormDataEntryValue | null;
	dayLeft: FormDataEntryValue | null;
	dayRight: FormDataEntryValue | null;
	leftStartHour: FormDataEntryValue | null;
	leftEndHour: FormDataEntryValue | null;
	rightStartHour: FormDataEntryValue | null;
	rightEndHour: FormDataEntryValue | null;
	slug?: FormDataEntryValue | null;
}

export const post: RequestHandler<Record<string, string>> = async (event) => {
	const { request } = event;

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);

	try {
		const formData = await request.formData();

		let values: DbData = {
			streetName: formData.get('street-name'),
			dayLeft: formData.get('day-left'),
			dayRight: formData.get('day-right'),
			leftStartHour: formData.get('left-start-hour'),
			leftEndHour: formData.get('left-end-hour'),
			rightStartHour: formData.get('right-start-hour'),
			rightEndHour: formData.get('right-end-hour')
		};

		if (values) {
			values = { ...values, slug: slugify(values.streetName as string) };
			try {
				const docRef = await addDoc(collection(db, 'streets'), {
					name: values.streetName,
					day_left: values.dayLeft,
					day_right: values.dayRight,
					left_start_hour: values.leftStartHour,
					left_end_hour: values.leftEndHour,
					right_start_hour: values.rightStartHour,
					right_end_hour: values.rightEndHour,
					slug: values.slug
				});
				console.log('Document written with ID: ', docRef.id);
			} catch (e) {
				console.error('Error adding document: ', e);
			}

			const cookies = makeCookies(values.slug);
			return {
				status: 200,
				headers: {
					'set-cookie': cookies
				}
			};
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
