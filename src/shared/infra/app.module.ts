import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CampaignModule } from "src/campaign/infra/modules/campaign.module";
import { envSchema } from "./env/env.schema";
import { CustomPrismaModule } from "nestjs-prisma";
import { ExtendedPrismaConfigService } from "./prisma/prisma-extended.service";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		CustomPrismaModule.forRootAsync({
			name: "PrismaService",
			useClass: ExtendedPrismaConfigService,
			isGlobal: true,
		}),
		CampaignModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
