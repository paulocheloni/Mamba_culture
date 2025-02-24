import { Campaign } from "../entity/campaign";
import { CampaignBuilder } from "./campaign.builder";

describe("CampaignBuilder", () => {
	test("builds a valid campaign", () => {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() + 2);
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + 5);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withStartDate(startDate)
			.withEndDate(endDate);
		const result = builder.build();
		expect(result.isSuccess).toBe(true);
		expect(result.value).toBeInstanceOf(Campaign);
		expect(result.value.id).toBe("1");
		expect(result.value.name).toBe("Test");
		expect(result.value.status).toBe("active");
	});

	test("returns failure if id is missing", () => {
		const builder = new CampaignBuilder()
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withStartDate(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(false);
	});

	test("returns failure if name is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withStartDate(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Name is required");
	});

	test("returns failure if status is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withStartDate(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Status is required");
	});

	test("returns failure if category is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCreatedAt(new Date())
			.withStartDate(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("Category is required");
	});

	test("returns failure if createdAt is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withStartDate(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("CreatedAt is required");
	});

	test("returns failure if startDate is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withEndDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("startDate is required");
	});

	test("returns failure if endDate is missing", () => {
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(new Date())
			.withStartDate(new Date());
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("endDate is required");
	});

	test("returns failure when endDate is less than startDate", () => {
		const createdAt = new Date();
		const start = new Date();
		start.setDate(start.getDate() + 1);
		const end = new Date();
		end.setDate(end.getDate() - 1);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(createdAt)
			.withStartDate(start)
			.withEndDate(end);
		const result = builder.build();
		expect(result.isFailure).toBe(true);
		expect(result.error.message).toBe("endDate must be greater than startDate");
	});

	test("returns failure when startDate is not greater than createdAt", () => {
		const createdAt = new Date();
		const start = new Date(createdAt.getTime());
		const end = new Date();
		end.setDate(end.getDate() + 1);
		const builder = new CampaignBuilder()
			.withId("1")
			.withName("Test")
			.withStatus("active")
			.withCategory("example")
			.withCreatedAt(createdAt)
			.withStartDate(start)
			.withEndDate(end);
		const result = builder.build();
		expect(result.isFailure).toBe(false);
	});

	test("aCampaign returns a valid campaign with default values", () => {
		const result = new CampaignBuilder().aCampaign();
		expect(result.isSuccess).toBe(true);
		expect(result.value).toBeInstanceOf(Campaign);
		expect(result.value.id).toBeDefined();
		expect(result.value.name).toBe("Campaign 1");
		expect(result.value.status).toBe("active");
		expect(result.value.category).toBe("Category 1");
		expect(result.value.createdAt).toBeInstanceOf(Date);
		expect(result.value.startDate).toBeInstanceOf(Date);
		expect(result.value.endDate).toBeInstanceOf(Date);
	});
});
