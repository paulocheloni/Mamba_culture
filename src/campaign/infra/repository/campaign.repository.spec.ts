import { CampaignBuilder } from "src/campaign/domain/campaign/builder/campaign.builder";
import { CampaignRepository } from "./campaign.repository";

describe("CampaignRepository", () => {
	let repository: CampaignRepository;

	beforeEach(() => {
		repository = new CampaignRepository();
	});

	it("should be defined", () => {
		expect(repository).toBeTruthy();
	});

	describe("create", () => {
		it("should create a new campaign when ID and name are unique", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;

			const result = await repository.create(campaign);
			expect(result.value).toBeUndefined();
			expect(result.isSuccess).toBe(true);
		});

		it("should fail when campaign ID already exists", async () => {
			const campaign1 = new CampaignBuilder().customCampaign({
				id: "1",
				name: "Campaign One",
			});

			const campaign2 = new CampaignBuilder().customCampaign({
				id: "1",
				name: "Campaign One",
			});
			const secondResult = await repository.create(campaign2.value);
			expect(secondResult.isSuccess).toBe(true);
			const result = await repository.create(campaign1.value);

			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign already exists");
		});

		it("should fail when campaign name already exists", async () => {
			const campaign1 = new CampaignBuilder().customCampaign({
				id: "1",
				name: "Campaign One",
			});

			const campaign2 = new CampaignBuilder().customCampaign({
				id: "2",
				name: "Campaign One",
			});

			await repository.create(campaign1.value);

			const result = await repository.create(campaign2.value);
			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign already exists");
		});
	});

	describe("save", () => {
		it("should fail when campaign to save is not found", async () => {
			const campaign = { id: "99", name: "NonExistentCampaign" } as any;

			const result = await repository.save(campaign);
			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign not found");
		});

		it("should fail when the name conflicts with a different campaign", async () => {
			const campaign1 = { id: "1", name: "Campaign One" } as any;
			const campaign2 = { id: "2", name: "Campaign Two" } as any;
			const campaign2Updated = { id: "2", name: "Campaign One" } as any;
			await repository.create(campaign1);
			await repository.create(campaign2);

			const result = await repository.save(campaign2Updated);
			expect(result.isFailure).toBe(true);
			expect(result.error.message).toBe("Campaign name already exists");
		});

		it("should save changes when campaign is found and name is unique", async () => {
			const createdCampaign = new CampaignBuilder().customCampaign({
				id: "3",
				name: "Campaign Three",
			});

			const campaign = createdCampaign.isSuccess
				? createdCampaign.value
				: undefined;

			const creationResult = await repository.create(campaign);
			expect(creationResult.isSuccess).toBe(true);

			const updatedCampaign = new CampaignBuilder().customCampaign({
				id: "3",
				name: "Campaign Four",
			});
			expect(updatedCampaign.isSuccess).toBe(true);
			const result = await repository.save(updatedCampaign.value);
			expect(result.value).toBeUndefined();
			expect(result.isSuccess).toBe(true);
		});
	});

	describe("getById", () => {
		it("should get a campaign by ID", async () => {
			const data = new CampaignBuilder().customCampaign({
				id: "1",
				name: "Campaign One",
			});

			const campaign = data.isSuccess ? data.value : undefined;
			const creationResult = await repository.create(campaign);
			expect(creationResult.isSuccess).toBe(true);
			const result = await repository.getById("1");
			expect(result.value).toEqual(campaign);
			expect(result.isSuccess).toBe(true);
		});

		it("should fail when campaign is not found by ID", async () => {
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
			await expect(repository.getAll()).resolves.toEqual({
				value: campaigns,
				error: undefined,
				isFailure: false,
				isSuccess: true,
			});
		});
	});
});
