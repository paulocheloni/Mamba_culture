import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { GetCampaignQueryDto } from "./get-campaign-query.dto";

describe("GetCampaignQueryDto", () => {
	it("should validate with default values", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, {});
		const errors = await validate(dto);
		expect(errors.length).toBe(0);
		expect(dto.page).toBe(1);
		expect(dto.limit).toBe(10);
	});

	it("should validate with valid custom values", async () => {
		const input = {
			page: "2",
			limit: "20",
			category: "marketing",
			status: "active",
			includeDeleted: true,
			order: "desc",
			orderBy: "name",
			search: "test search",
		};
		const dto = plainToInstance(GetCampaignQueryDto, input);
		const errors = await validate(dto);
		expect(dto.category).toBe("marketing");
		expect(dto.status).toBe("active");
		expect(dto.includeDeleted).toBe(true);
		expect(dto.order).toBe("desc");
		expect(dto.orderBy).toBe("name");
		expect(dto.search).toBe("test search");
		expect(dto.page).toBe(2);
		expect(dto.limit).toBe(20);

		expect(errors.length).toBe(0);
		expect(dto.page).toBe(2);
		expect(dto.limit).toBe(20);
	});

	it("should fail if page is not a valid number", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, { page: "invalid" });
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "page")).toBe(true);
	});

	it("should fail if limit is not a valid number", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, { limit: "invalid" });
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "limit")).toBe(true);
	});

	it('should fail if status is not "active" or "paused"', async () => {
		const dto = plainToInstance(GetCampaignQueryDto, { status: "inactive" });
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "status")).toBe(true);
	});

	it("should fail if includeDeleted is not a boolean", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, {
			includeDeleted: "true",
		});
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "includeDeleted")).toBe(true);
	});

	it('should fail if order is not "asc" or "desc"', async () => {
		const dto = plainToInstance(GetCampaignQueryDto, { order: "up" });
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "order")).toBe(true);
	});

	it("should fail if orderBy exceeds maximum length", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, {
			orderBy: "a".repeat(31),
		});
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "orderBy")).toBe(true);
	});

	it("should fail if search exceeds maximum length", async () => {
		const dto = plainToInstance(GetCampaignQueryDto, {
			search: "a".repeat(256),
		});
		const errors = await validate(dto);
		expect(errors.some((e) => e.property === "search")).toBe(true);
	});
});
