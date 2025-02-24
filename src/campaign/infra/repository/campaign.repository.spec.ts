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
			await expect(repository.create(campaign)).resolves.toBeUndefined();
		});

		it("should fail when campaign ID already exists", async () => {
			const campaign1 = { id: "1", name: "Campaign One" } as any;
			const campaign2 = { id: "1", name: "Campaign Two" } as any;
			await repository.create(campaign1);
			await expect(repository.create(campaign2)).rejects.toThrow(
				"Campaign already exists",
			);
		});

		it("should fail when campaign name already exists", async () => {
			const campaign1 = { id: "1", name: "Campaign One" } as any;
			const campaign2 = { id: "2", name: "Campaign One" } as any;
			await repository.create(campaign1);
			await expect(repository.create(campaign2)).rejects.toThrow(
				"Campaign name already exists",
			);
		});
	});

	describe("save", () => {
		it("should fail when campaign to save is not found", async () => {
			const campaign = { id: "99", name: "NonExistentCampaign" } as any;
			await expect(repository.save(campaign)).rejects.toThrow(
				"Campaign not found",
			);
		});

		it("should fail when the name conflicts with a different campaign", async () => {
			const campaign1 = { id: "1", name: "Campaign One" } as any;
			const campaign2 = { id: "2", name: "Campaign Two" } as any;
			const campaign2Updated = { id: "2", name: "Campaign One" } as any;
			await repository.create(campaign1);
			await repository.create(campaign2);
			await expect(repository.save(campaign2Updated)).rejects.toThrow(
				"Campaign name already exists",
			);
		});

		it("should save changes when campaign is found and name is unique", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			const updatedCampaign = { id: "1", name: "Updated Campaign One" } as any;
			await repository.create(campaign);
			await expect(repository.save(updatedCampaign)).resolves.toBeUndefined();
		});
	});

	describe("getById", () => {
		it("should get a campaign by ID", async () => {
			const campaign = { id: "1", name: "Campaign One" } as any;
			await repository.create(campaign);
			await expect(repository.getById("1")).resolves.toEqual(campaign);
		});

		it("should fail when campaign is not found by ID", async () => {
			await expect(repository.getById("1")).rejects.toThrow(
				"Campaign not found",
			);
		});
	});

	describe("getAll", () => {
		it("should get all campaigns", async () => {
			const campaigns = [
				{ id: "1", name: "Campaign One" },
				{ id: "2", name: "Campaign Two" },
			] as any[];
			await Promise.all(campaigns.map((c) => repository.create(c)));
			await expect(repository.getAll()).resolves.toEqual(campaigns);
		});
	});
});
