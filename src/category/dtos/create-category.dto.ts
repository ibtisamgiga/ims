import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
