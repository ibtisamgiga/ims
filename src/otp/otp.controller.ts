import { Body, Controller, Post } from '@nestjs/common';
import { SendOtpDto } from './dtos/send-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}
  
}
