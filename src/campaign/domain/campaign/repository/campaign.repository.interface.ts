import { CampaignStatus } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
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

export class QueryableDTO {
	@IsOptional()
	@Transform(({ value }) =>
		value === "desc" || value === "asc" ? value : "asc",
	)
	order? = "asc";

	@IsOptional()
	@Transform(({ value }: { value: string }) =>
		value ? value.replace(/[^a-zA-Z0-9]/g, "") : "",
	)
	search? = "";

	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	includeDeleted? = false;

	@Transform(({ value }) => (value && value > 0 ? value : 1))
	@Type(() => Number)
	@IsOptional()
	page? = 1;

	@Type(() => Number)
	@IsOptional()
	@Transform(({ value }) => (value && value > 0 ? value : 10))
	limit? = 10;

	@IsOptional()
	@Transform(({ value }) => (value ? value : "name"))
	category? = "seasonal";

	@IsOptional()
	@Transform(({ value }) => (CampaignStatus[value] ? value : "active"))
	status? = "active";

	@IsOptional()
	@Transform(({ value }) =>
		value ? value.replace(/[^a-zA-Z0-9]/g, "") : "name",
	)
	orderBy? = "name";
}
export interface ICampaignRepository {
	create(campaign: Campaign): Promise<Result<void>>;
	getById(id: string): Promise<Result<Campaign>>;
	save(campaign: Campaign): Promise<Result<void>>;
	getByName(name: string): Promise<Result<Campaign>>;
	/** only works if NODE_ENV is test */
	reset(): void | Promise<void>;
}

export const ICampaignRepository = Symbol.for("ICampaignRepository");
