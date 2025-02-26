import { ApiProperty } from "@nestjs/swagger";

export class ErrorDto {
	@ApiProperty({
		required: true,
	})
	code: string;

	@ApiProperty({
		required: true,
	})
	message: string;
}
