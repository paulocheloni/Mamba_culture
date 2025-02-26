import {
	type ArgumentsHost,
	Catch,
	HttpException,
	type ExceptionFilter,
} from "@nestjs/common";
import { Result } from "src/shared/domain/result/result";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const status = exception.getStatus();

		const constrains = exception.getResponse() as Record<string, any>;

		const result = Result.fail({
			code: status,
			message: exception.message,
			timestamp: new Date().toISOString(),
			path: request.url,
			constrains,
		});

		response.status(status).json(result);
	}
}
