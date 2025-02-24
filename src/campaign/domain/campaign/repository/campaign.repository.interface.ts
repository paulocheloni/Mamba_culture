import type { Campaign } from "../entity/campaign";

export type IQueryable = {
	sort?: "asc" | "desc";
	order?: string;
	search?: string;
	includeDeleted?: boolean;
	page?: number;
	limit?: number;
	category?: string;
	status?: string;
	orderBy?: string;

	[key: string]: string | number | boolean;
};
export interface ICampaignRepository {
	create(campaign: Campaign): Promise<void>;
	getById(id: string): Promise<Campaign>;
	save(campaign: Campaign): Promise<void>;
	getAll(query: IQueryable): Promise<Campaign[]>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
