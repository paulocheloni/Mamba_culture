import { Inject, Injectable } from "@nestjs/common";
import { ICampaignRepository } from "src/campaign/domain/campaign/repository/campaign.repository.interface";
import { CampaignError } from "src/shared/domain/errors/campaign-error";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import { Result } from "src/shared/domain/result/result";

@Injectable()
export class DeleteCampaignUseCase {
	constructor(
		@Inject(ICampaignRepository)
		private readonly campaignRepository: ICampaignRepository,
	) {}

	async execute(id: string) {
		const findResult = await this.campaignRepository.getById(id);
		if (findResult.isFailure) {
			return Result.fail(findResult.error);
		}

		if (!findResult?.value) {
			return Result.fail(
				new CampaignError(
					CampaignErrorCodes.CAMPAIGN_NOT_FOUND,
					"Campaign not found",
				),
			);
		}
		const deletionResult = findResult.value.delete();
		if (!deletionResult?.isSuccess) {
			return Result.fail(deletionResult.error);
		}

		return this.campaignRepository.save(findResult.value);
	}
}
