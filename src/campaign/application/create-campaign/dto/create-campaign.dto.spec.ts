import { CreateCampaignDto } from "./create-campaign.dto";

describe("CreateCampaignDto", () => {
	let dto: CreateCampaignDto;
	beforeAll(() => {
		dto = new CreateCampaignDto();
		dto.category = "seasonal";
		dto.name = "Campaign One";
		dto.startDate = new Date();
		dto.endDate = new Date();
		dto.status = "active";
	});

	it("should be defined", () => {
		expect(dto).toBeTruthy();
	});

	it("should have a category property", () => {
		expect(dto.category).toBeDefined();
	});

	it("should have a name property", () => {
		expect(dto).toHaveProperty("name");
	});

	it("should have a startDate property", () => {
		expect(dto).toHaveProperty("startDate");
	});

	it("should have a endDate property", () => {
		expect(dto).toHaveProperty("endDate");
	});
});
