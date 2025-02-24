import type { Campaign } from "../entity/campaign";
export interface ICampaignRepository {
	create(campaign: Campaign): Promise<void>;
	getById(id: string): Promise<Campaign>;
	// getAll(): Promise<ICampaign[]>;
	// update(campaign: ICampaign): Promise<void>;
	save(campaign: Campaign): Promise<void>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
