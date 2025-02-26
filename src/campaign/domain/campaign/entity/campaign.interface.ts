export enum CampaignStatus {
	active = "active",
	paused = "paused",
	expired = "expired",
}

export enum CampaignCategory {
	seasonal = "seasonal",
	regular = "regular",
	special = "special",
}

export interface ICampaign {
	id: string;
	name: string;

	status: keyof typeof CampaignStatus;
	category: keyof typeof CampaignCategory;

	createdAt: Date;
	startDate: Date;
	endDate: Date;
	deletedAt?: Date;
}
