import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type {
	ICampaignRepository,
	IQueryable,
} from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { Result } from "src/shared/domain/result/result";
import type { Campaign as CampaignModel } from "@prisma/client";

@Injectable()
export class CampaignPrismaRepository implements ICampaignRepository {
	constructor(
		@Inject(PrismaService) private readonly prismaService: PrismaService,
	) {}

	async create(campaign: Campaign): Promise<Result<void>> {
		try {
			await this.prismaService.campaign.create({
				data: {
					id: campaign.id,
					name: campaign.name,
					category: campaign.category,
					status: campaign.status,
					createdAt: campaign.createdAt,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
				},
			});
			return Result.ok();
		} catch (error) {
			return Result.fail(error);
		}
	}
	async getById(id: string): Promise<Result<Campaign>> {
		try {
			const campaignData = await this.prismaService.campaign.findUnique({
				where: { id },
			});
			if (!campaignData) {
				return Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				);
			}
			const campaign = Campaign.create({
				id: campaignData.id,
				name: campaignData.name,
				category: campaignData.category,
				status: campaignData.status,
				createdAt: campaignData.createdAt,
				startDate: campaignData.startDate,
				endDate: campaignData.endDate,
			});

			return campaign;
		} catch (error) {
			return Result.fail(error);
		}
	}
	async save(campaign: Campaign): Promise<Result<void>> {
		try {
			await this.prismaService.campaign.update({
				where: { id: campaign.id },
				data: {
					name: campaign.name,
					category: campaign.category,
					status: campaign.status,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
				},
			});
			return Result.ok();
		} catch (error) {
			return Result.fail(error);
		}
	}
	async getAll(query: IQueryable): Promise<Result<CampaignModel[]>> {
		try {
			const response = await this.prismaService.campaign.findMany({
				where: {
					OR: [
						{
							name: {
								contains: query.search,
							},
						},
					],
				},
				distinct: ["id"],

				skip: query.page * query.limit,
				take: query.limit,
				orderBy: { [query.orderBy]: query.order },
				select: {
					id: true,
					name: true,
					category: true,
					status: true,
					createdAt: true,
					startDate: true,
					endDate: true,
					deletedAt: true,
				},
			});
			return Result.ok(response);
		} catch (error) {
			return Result.fail(error);
		}
	}

	async getByName(name: string): Promise<Result<Campaign>> {
		try {
			const prismaResponse = await this.prismaService.campaign.findFirst({
				where: { AND: [{ name }, { NOT: { deletedAt: null } }] },
			});
			if (!prismaResponse) {
				return Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAING_NOT_FOUND,
						"Campaign not found",
					),
				);
			}
			const campaign = Campaign.create({
				id: prismaResponse.id,
				name: prismaResponse.name,
				category: prismaResponse.category,
				status: prismaResponse.status,
				createdAt: prismaResponse.createdAt,
				startDate: prismaResponse.startDate,
				endDate: prismaResponse.endDate,
			});
			return campaign;
		} catch (error) {
			return Result.fail(error);
		}
	}
}
