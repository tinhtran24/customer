import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ example: 15, description: 'count items' })
    limit?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        example: 2,
        description: 'count pages by page size (default: 10)'
    })
    page?: string;
}