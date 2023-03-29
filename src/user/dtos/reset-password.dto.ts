import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  otp: string;
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password to weak',
  })
  @IsNotEmpty()
  password: string;
}
