import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CampaignModule } from "src/campaign/infra/modules/campaign.module";
import { envSchema } from "./env/env.schema";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		CampaignModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
