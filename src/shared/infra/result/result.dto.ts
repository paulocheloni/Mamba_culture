import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ErrorDto } from "./error.dto";

export class ResultDto {
	@ApiProperty({
		required: true,
	})
	isSuccess: boolean;

	@ApiProperty({
		required: true,
	})
	isFailure: boolean;

	@ApiProperty({
		required: false,
	})
	@Type(() => ErrorDto)
	error?: ErrorDto;
}
