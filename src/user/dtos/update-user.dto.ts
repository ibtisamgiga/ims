import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: 'only alphabets' })
  name: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  privateEmail: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  @Matches(/^[0-9]+$/, { message: 'Enter Number only' })
  contactNo: string;
}
