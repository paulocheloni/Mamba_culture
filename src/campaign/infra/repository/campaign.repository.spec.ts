import { CampaignRepository } from "./campaign.repository";

describe("CampaignRepository", () => {
	let repository: CampaignRepository;

	beforeAll(() => {
		repository = new CampaignRepository();
	});

	it("should be defined", () => {
		expect(repository).toBeTruthy();
	});

	it("should have a create method", () => {
		expect(repository.create).toBeDefined();
	});

	it("should have a save method", () => {
		expect(repository.save).toBeDefined();
	});
});
