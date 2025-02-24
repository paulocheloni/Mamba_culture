import type { Result } from "src/shared/domain/result/result";
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
	create(campaign: Campaign): Promise<Result<void>>;
	getById(id: string): Promise<Result<Campaign>>;
	save(campaign: Campaign): Promise<Result<void>>;
	getAll(query: IQueryable): Promise<Result<Campaign[]>>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
