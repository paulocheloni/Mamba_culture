import { Inject, Injectable } from "@nestjs/common";
import { Campaign } from "src/campaign/domain/campaign/entity/campaign";
import type {
	ICampaignRepository,
	IQueryable,
	QueryableDTO,
} from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { Result } from "src/shared/domain/result/result";
import { TestableRepository } from "src/shared/domain/repository/testable.repository";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";
import type { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "src/shared/infra/prisma/prisma.extension";

@Injectable()
export class CampaignPrismaRepository
	extends TestableRepository
	implements ICampaignRepository
{
	constructor(
		@Inject(PrismaService)
		private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
	) {
		super();
	}

	protected async callReset(): Promise<void> {
		await this.prismaService.client.campaign.deleteMany();
	}

	async create(campaign: Campaign): Promise<Result<void>> {
		try {
			await this.prismaService.client.campaign.create({
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
			const campaignData = await this.prismaService.client.campaign.findUnique({
				where: { id, deletedAt: null },
			});
			if (!campaignData) {
				return Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAIGN_NOT_FOUND,
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
			await this.prismaService.client.campaign.update({
				where: { id: campaign.id },
				data: {
					name: campaign.name,
					category: campaign.category,
					status: campaign.status,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
					deletedAt: campaign.deletedAt,
				},
			});
			return Result.ok();
		} catch (error) {
			return Result.fail(error);
		}
	}

	async getByName(name: string): Promise<Result<Campaign>> {
		try {
			const prismaResponse = await this.prismaService.client.campaign.findFirst(
				{
					where: { name, deletedAt: null },
				},
			);
			if (!prismaResponse) {
				return Result.fail(
					new CampaignError(
						CampaignErrorCodes.CAMPAIGN_NOT_FOUND,
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
