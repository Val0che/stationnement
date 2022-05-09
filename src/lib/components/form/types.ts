type DefaultEventDetail = {
	form: HTMLFormElement;
};
export type SubmitEventDetail = DefaultEventDetail & {
	event: Event;
	formData: FormData;
};
export type InvalidateEventDetail = DefaultEventDetail;
export type SuccessEventDetail = DefaultEventDetail;
export type ErrorEventDetail = DefaultEventDetail & {
	error: Error;
};
export type CompleteEventDetail = DefaultEventDetail;
export type CancelEventDetail = DefaultEventDetail;
export type FormEvents = {
	submit: SubmitEventDetail;
	success: SuccessEventDetail;
	error: ErrorEventDetail;
	complete: CompleteEventDetail;
	cancel: CancelEventDetail;
	invalidate: InvalidateEventDetail;
};
