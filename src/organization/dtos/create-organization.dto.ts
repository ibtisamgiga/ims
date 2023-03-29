import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(100)
  bio: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: 'only alphabets' })
  repName: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  @Matches(/^[0-9]+$/, { message: 'Enter Number only' })
  repContactNo: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: 'Enter Number only' })
  zip: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
