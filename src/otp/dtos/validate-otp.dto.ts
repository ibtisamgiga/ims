import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  otp: string;
}
