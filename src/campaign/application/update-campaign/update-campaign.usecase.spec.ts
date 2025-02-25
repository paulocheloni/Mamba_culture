import type { Mocked } from "@suites/doubles.jest";
import type { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { UpdateCampaignUseCase } from "./update-campaign.usecase";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { TestBed } from "@suites/unit";
import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";
import type {
	CampaignCategory,
	CampaignStatus,
} from "src/campaign/domain/campaign/entity/campaign.interface";

describe("UpdateCampaignUseCase", () => {
	let useCase: UpdateCampaignUseCase;
	let campaignRepository: Mocked<ICampaignRepository>;

	beforeEach(async () => {
		const { unit, unitRef } = await TestBed.solitary(
			UpdateCampaignUseCase,
		).compile();
		useCase = unit;
		campaignRepository = unitRef.get(ICampaignRepository);
	});

	it("should throw an error if campaign does not exist", async () => {
		campaignRepository.getById.mockResolvedValue(null);
		const dto = {
			id: "123",
			category: "New Category",
			endDate: new Date("2023-12-31"),
			name: "New Campaign",
			startDate: new Date("2023-01-01"),
			createdAt: new Date("2023-01-01"),

			status: "active",
		};
		const result = await useCase.execute(dto as UpdateCampaignDto);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Campaign not found");
	});

	it("should throw an error if campaign is deleted", async () => {
		const deletedCampaign = { id: "123", isDeleted: () => true };
		campaignRepository.getById.mockResolvedValue(deletedCampaign as any);
		const dto = {
			id: "123",
			category: "New Category",
			endDate: new Date("2023-12-31"),
			name: "New Campaign",
			startDate: new Date("2023-01-01"),
			createdAt: new Date("2023-01-01"),
			status: "active",
		};
		const result = await useCase.execute(dto as UpdateCampaignDto);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Campaign not found");
	});

	it("should update campaign if it exists and is not deleted", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() + 1);
		yesterday.setDate(now.getDate() - 1);

		const existingDto = {
			id: "123",
			isDeleted: () => false,
			createdAt: now,
			category: "seasonal" as keyof typeof CampaignCategory,
			name: "Campaign",
			startDate: now,
			endDate: nexthour,
			status: "active",
		};
		const existingCampaign = new CampaignBuilder()
			.withCategory(existingDto.category)
			.withCreatedAt(existingDto.createdAt)
			.withEndDate(existingDto.endDate)
			.withStatus(existingDto.status as CampaignStatus)
			.withStartDate(existingDto.startDate)
			.withId(existingDto.id)
			.withName(existingDto.name)
			.build();

		campaignRepository.getById.mockResolvedValue(existingCampaign);
		const dto = {
			id: "123",
			category: "seasonal",
			endDate: nexthour,
			name: "Updated Campaign",
			startDate: now,
			createdAt: yesterday,
			status: "active",
		};
		const result = await useCase.execute(dto as UpdateCampaignDto);
		expect(result).toBe(undefined);
		expect(campaignRepository.save).toHaveBeenCalled();
	});

	it("should fail when a campaign already exists with the same name", async () => {
		const now = new Date();
		const nexthour = new Date();
		const yesterday = new Date();

		nexthour.setHours(now.getHours() + 1);
		yesterday.setDate(now.getDate() - 1);

		const existingDto = {
			id: "123",
			isDeleted: () => false,
			createdAt: now,
			category: "seasonal" as keyof typeof CampaignCategory,
			name: "Campaign",
			startDate: now,
			endDate: nexthour,
			status: "active",
		};
		const existingCampaign = new CampaignBuilder()
			.withCategory(existingDto.category)
			.withCreatedAt(existingDto.createdAt)
			.withEndDate(existingDto.endDate)
			.withStatus(existingDto.status as CampaignStatus)
			.withStartDate(existingDto.startDate)
			.withId(existingDto.id)
			.withName(existingDto.name)
			.build();

		campaignRepository.getById.mockResolvedValue(existingCampaign);
		const dto = {
			id: "123",
			category: "seasonal",
			endDate: nexthour,
			name: "Updated Campaign",
			startDate: now,
			createdAt: yesterday,
			status: "active",
		};
		campaignRepository.save.mockResolvedValue({
			isFailure: true,
			error: new Error("Campaign already exists"),
			isSuccess: false,
		});
		const result = await useCase.execute(dto as UpdateCampaignDto);
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Campaign already exists");
	});
});
