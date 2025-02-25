import type { Result } from "src/shared/domain/result/result";
import type { Campaign } from "../entity/campaign";
import type { Campaign as CampaignModel } from "@prisma/client";
import type { ICampaign } from "../entity/campaign.interface";

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
	getByName(name: string): Promise<Result<Campaign>>;
	getAll(query: IQueryable): Promise<Result<ICampaign[]>>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
