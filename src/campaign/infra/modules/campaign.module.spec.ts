import { Test } from "@nestjs/testing";
import { CustomPrismaModule } from "nestjs-prisma";
import { ExtendedPrismaConfigService } from "src/shared/infra/prisma/prisma-extended.service";
import { CampaignModule } from "./campaign.module";

describe("CampaignModule", () => {
	let module: CampaignModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				CampaignModule,
				CustomPrismaModule.forRootAsync({
					name: "PrismaService",
					useClass: ExtendedPrismaConfigService,
					isGlobal: true,
				}),
			],
		}).compile();
	});

	it("should be defined", () => {
		expect(module).toBeTruthy();
	});
});
