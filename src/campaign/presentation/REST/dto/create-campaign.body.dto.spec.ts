import { validate } from "class-validator";
import { CreateCampaignBodyDto } from "./create-campaign-body.dto";

describe("CreateCampaignBodyDto", () => {
	let validDto: CreateCampaignBodyDto;

	beforeEach(() => {
		validDto = new CreateCampaignBodyDto();
		validDto.name = "My Campaign";
		validDto.category = "Marketing";
		validDto.startDate = new Date("2023-01-01");
		validDto.endDate = new Date("2023-12-31");
	});

	it("should validate correctly with valid data", async () => {
		const errors = await validate(validDto);
		expect(errors.length).toBe(0);
	});

	it('should fail validation if "name" is empty', async () => {
		const dto = { ...validDto, name: "" };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should fail validation if "category" is empty', async () => {
		const dto = { ...validDto, category: "" };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should fail validation if "startDate" is invalid', async () => {
		const dto = { ...validDto, startDate: "Invalid Date" as unknown as Date };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should fail validation if "endDate" is invalid', async () => {
		const dto = { ...validDto, endDate: "Invalid Date" as unknown as Date };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should fail validation if "startDate" is missing', async () => {
		const dto = { ...validDto, startDate: undefined };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('should fail validation if "endDate" is missing', async () => {
		const dto = { ...validDto, endDate: undefined };
		const instance = Object.assign(new CreateCampaignBodyDto(), dto);
		const errors = await validate(instance);
		expect(errors.length).toBeGreaterThan(0);
	});
});
