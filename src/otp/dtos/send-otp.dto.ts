import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
