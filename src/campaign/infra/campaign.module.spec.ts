import { Test, TestingModule, TestingModuleBuilder } from "@nestjs/testing";
import { CampaignModule } from "./campaign.module";

describe("CampaignModule", () => {
	let module: CampaignModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [CampaignModule],
		}).compile();
	});

	it("should be defined", () => {
		expect(module).toBeTruthy();
	});
});
