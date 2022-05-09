/// <reference types="@sveltejs/kit" />

import type { JSONValue } from '@sveltejs/kit/types/internal';

declare global {
	interface DBData {
		name: FormDataEntryValue | null;
		day_left: FormDataEntryValue | null;
		day_right: FormDataEntryValue | null;
		left_start_hour: FormDataEntryValue | null;
		left_end_hour: FormDataEntryValue | null;
		right_start_hour: FormDataEntryValue | null;
		right_end_hour: FormDataEntryValue | null;
		slug?: FormDataEntryValue | null;
	}

	type ActionData<Data = Record<string, JSONValue>> = {
		action?: string;
		values?: Record<string, string | string[]>;
		errors?: {
			[key: string]: true | string;
		};
		success?: true;
		message?: string;
		data?: Data;
	};

	interface ImportMetaEnv {
		VITE_FIREBASE_API_KEY: string;
		VITE_MAPS_API_KEY: string;
	}
}
