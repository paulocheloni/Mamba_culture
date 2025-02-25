import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CampaignModule } from "src/campaign/infra/modules/campaign.module";
import { envSchema } from "./env/env.schema";
import { PrismaModule } from "nestjs-prisma";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		PrismaModule.forRoot({
			isGlobal: true,
		}),
		CampaignModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
