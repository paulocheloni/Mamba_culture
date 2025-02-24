export enum CampaignStatus {
	active = "active",
	paused = "paused",
	expired = "expired",
}

export interface ICampaign {
	id: string;
	name: string;

	status: keyof typeof CampaignStatus;
	category: string;

	createdAt: Date;
	startDate: Date;
	endDate: Date;
	deletedAt?: Date;
}
