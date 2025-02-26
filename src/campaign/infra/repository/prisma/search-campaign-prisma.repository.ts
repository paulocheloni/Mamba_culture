import type { CustomPrismaService } from "nestjs-prisma";
import type { QueryableDTO } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import type { ExtendedPrismaClient } from "src/shared/infra/prisma/prisma.extension";
import { SearchCampaignDTO } from "./dto/search-campaign.dto";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/infra/prisma/prisma-extended.service";

@Injectable()
export class SearchCampaignPrismaRepository {
	constructor(
		@Inject(PrismaService)
		private readonly prismaExtended: CustomPrismaService<ExtendedPrismaClient>,
	) {}
	async getAll(query: QueryableDTO): Promise<SearchCampaignDTO> {
		const { page, limit, search, orderBy, order } = query;
		const skip = (page - 1) * limit;

		const orderOptions = order ? { [orderBy]: order } : undefined;

		try {
			const [data, total] = await Promise.all([
				this.prismaExtended.client.campaign.findMany({
					skip,
					take: limit,
					where: {
						name: { contains: search || "", mode: "insensitive" },
						deletedAt: null,
					},
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
					orderBy: orderOptions,
				}),
				this.prismaExtended.client.campaign.count({
					where: {
						name: { contains: search || "", mode: "insensitive" },
						deletedAt: null,
					},
				}),
			]);

			const totalPages = Math.ceil(total / limit);
			const hasPrevPage = page > 1;
			const hasNextPage = page < totalPages;

			const response = {
				result: data,
				page,
				limit,
				count: total,
				totalPages,
				hasPrevPage,
				hasNextPage,
			};

			const dto = new SearchCampaignDTO(response.result);
			dto.isSuccess = true;
			dto.isFailure = false;
			dto.metadata = {
				currentPage: page,
				perPage: limit,
				total: total,
				totalPages: totalPages,
				hasPrevPage: hasPrevPage,
				hasNextPage: hasNextPage,
			};

			return dto;
		} catch (error) {
			const dto = new SearchCampaignDTO([]);
			dto.isFailure = true;
			dto.isSuccess = false;
			dto.error = error;
			return dto;
		}
	}
}
