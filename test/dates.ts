/** Calendar dates relative to now, so domain date rules stay valid. */
export function daysFromNow(days: number): Date {
	const date = new Date();
	date.setUTCHours(12, 0, 0, 0);
	date.setUTCDate(date.getUTCDate() + days);
	return date;
}
