/// <reference types="@sveltejs/kit" />

declare global {
	type DbData = {
		streetName: FormDataEntryValue | null;
		dayLeft: FormDataEntryValue | null;
		dayRight: FormDataEntryValue | null;
		leftStartHour: FormDataEntryValue | null;
		leftEndHour: FormDataEntryValue | null;
		rightStartHour: FormDataEntryValue | null;
		rightEndHour: FormDataEntryValue | null;
		slug?: string | null;
	};
}
