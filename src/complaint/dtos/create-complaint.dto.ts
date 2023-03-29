import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompalintDto {
  @IsOptional()
  @IsString()
  @IsIn(['Pending','Resolved'])
  status: string;

  @IsString()
  images: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
