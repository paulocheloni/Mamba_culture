export class CreateCampaignDto {
	name: string;
	category: string;
	startDate: Date;
	endDate: Date;
	status?: "active" | "paused" = "active";
}
