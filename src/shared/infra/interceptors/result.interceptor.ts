import {
	Injectable,
	type NestInterceptor,
	type ExecutionContext,
	type CallHandler,
} from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { isResult, type Result } from "src/shared/domain/result/result";
import { CampaignErrorCodes } from "src/shared/domain/errors/campaign-error-codes";
import type { Request, Response } from "express";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpContext = context.switchToHttp();
		const response = httpContext.getResponse<Response>();
		const request = httpContext.getRequest<Request>();

		return next.handle().pipe(
			map((result: Result<T>) => {
				if (!isResult(result)) {
					return result;
				}

				const statusCode = result.isSuccess
					? this.getSuccessStatusCode(request.method)
					: this.getErrorStatusCode(result.error?.code);

				const res = {
					isSuccess: result.isSuccess,
					isFailure: result.isFailure,
					value: result.value !== undefined ? result.value : undefined,
					error: result.error
						? {
								code: result.error?.code,
								message: result.error.message,
							}
						: undefined,
				};

				response.status(statusCode).send(res);
			}),
		);
	}

	private getSuccessStatusCode(method: string): number {
		switch (method) {
			case "POST":
				return 201;
			case "PUT":
			case "DELETE":
				return 200;
			case "GET":
				return 200;
			default:
				return 200;
		}
	}

	private getErrorStatusCode(errorCode: CampaignErrorCodes): number {
		switch (errorCode) {
			case CampaignErrorCodes.ID_REQUIRED:
			case CampaignErrorCodes.NAME_REQUIRED:
			case CampaignErrorCodes.STATUS_REQUIRED:
			case CampaignErrorCodes.CATEGORY_REQUIRED:
			case CampaignErrorCodes.CREATED_AT_REQUIRED:
			case CampaignErrorCodes.START_DATE_REQUIRED:
			case CampaignErrorCodes.END_DATE_REQUIRED:
			case CampaignErrorCodes.END_DATE_BEFORE_START_DATE:
			case CampaignErrorCodes.START_DATE_BEFORE_CREATED_AT:
			case CampaignErrorCodes.INVALID_STATUS:
			case CampaignErrorCodes.INVALID_CATEGORY:
				return 400;
			case CampaignErrorCodes.CAMPAIGN_NOT_FOUND:
				return 404;
			case CampaignErrorCodes.CANNOT_PAUSE_EXPIRED_CAMPAIGN:
			case CampaignErrorCodes.CANNOT_PAUSE_DELETED_CAMPAIGN:
			case CampaignErrorCodes.CANNOT_ACTIVATE_EXPIRED_CAMPAIGN:
			case CampaignErrorCodes.CANNOT_ACTIVATE_DELETED_CAMPAIGN:
				return 409;
			case CampaignErrorCodes.CAMPAIGN_ALREADY_EXISTS:
				return 409;
			default:
				return 500;
		}
	}
}
