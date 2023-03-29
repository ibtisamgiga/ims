import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
