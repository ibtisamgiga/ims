import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/opt.entity';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
// TypeOrmModule.forFeature([Organization]),UserModule
