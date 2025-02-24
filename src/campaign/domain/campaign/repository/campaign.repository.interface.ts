import type { ICampaign } from "../entity/campaign.interface";
export interface ICampaignRepository {
	create(campaign: ICampaign): Promise<void>;
	getById(id: string): Promise<ICampaign>;
	// getAll(): Promise<ICampaign[]>;
	// update(campaign: ICampaign): Promise<void>;
	save(campaign: ICampaign): Promise<void>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
