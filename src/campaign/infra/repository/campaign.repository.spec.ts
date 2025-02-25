import { TestBed } from "@suites/unit";
import { CampaignRepository } from "./campaign.repository";

describe("CampaignRepository", () => {
	let repository: CampaignRepository;

	beforeEach(async () => {
		const { unit, unitRef } =
			await TestBed.solitary(CampaignRepository).compile();

		repository = unit;
	});

	it("should be defined", () => {
		expect(repository).toBeTruthy();
	});

	describe("create", () => {
		it("should store a new campaign", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;

			const result = await repository.create(campaign);
			expect(result.value).toBeUndefined();
			expect(result.isSuccess).toBe(true);
		});
	});

	describe("save", () => {
		it("should update existing campaign", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			await repository.create(campaign);

			const updatedCampaign = { id: "1", name: "Updated Campaign" } as any;
			const result = await repository.save(updatedCampaign);

			expect(result.isSuccess).toBe(true);
			const getResult = await repository.getById("1");
			expect(getResult.value.name).toBe("Updated Campaign");
		});

		it("should fail when campaign doesn't exist", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			const result = await repository.save(campaign);

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
		});
	});

	describe("getById", () => {
		it("should get a campaign by ID", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			await repository.create(campaign);

			const result = await repository.getById("1");
			expect(result.value).toEqual(campaign);
			expect(result.isSuccess).toBe(true);
		});

		it("should fail when campaign is not found", async () => {
			const result = await repository.getById("1");
			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
		});
	});

	describe("getAll", () => {
		it("should get all campaigns", async () => {
			const campaigns = [
				{ id: "1", name: "Campaign One" },
				{ id: "2", name: "Campaign Two" },
			] as any[];

			await Promise.all(campaigns.map((c) => repository.create(c)));
			const result = await repository.getAll();

			expect(result.value).toEqual(campaigns);
			expect(result.isSuccess).toBe(true);
		});

		it("should return empty array when no campaigns exist", async () => {
			const result = await repository.getAll();
			expect(result.value).toEqual([]);
			expect(result.isSuccess).toBe(true);
		});
	});

	describe("getByName", () => {
		it("should get a campaign by name", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			await repository.create(campaign);

			const result = await repository.getByName("Campaign One");
			expect(result.value).toEqual(campaign);
			expect(result.isSuccess).toBe(true);
		});

		it("should fail when campaign is not found", async () => {
			const result = await repository.getByName("Campaign One");
			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
		});
	});
});
