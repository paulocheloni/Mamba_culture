export class CreateCampaignDto {
	name: string;
	category: "seasonal" | "regular" | "special";
	startDate: Date;
	endDate: Date;
	status?: "active" | "paused" = "active";
}
