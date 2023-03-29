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

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: 'only alphabets' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password to weak',
  })
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  privateEmail: string;

  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  @Matches(/^[0-9]+$/, { message: 'Enter Number only' })
  contactNo: string;

  @Matches(/^[0-9]+$/, { message: 'Enter Number only from ' })
  @IsOptional()
  organizationId: number;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'superadmin', 'employee'])
  role: string;
}
