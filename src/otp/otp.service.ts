import { MailerService } from '@nestjs-modules/mailer';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { SendOtpDto } from './dtos/send-otp.dto';
import { Otp } from './entity/opt.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    // private readonly userService: UserService,
    private readonly mailService: MailerService,
  ) {}

  /*********PRIVATE FUNCTION TO GENERATE OTP */
  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { email } = sendOtpDto;
    const otpCode = this.generateOTP();
    const currentTime = new Date().getTime() + 300 * 1000;
    const otpData = {
      email: email,
      otp: otpCode,
      expiresIn: currentTime,
    };
    const emailBody = {
      to: sendOtpDto.email,
      from: 'm.ibtisam@gigalabs.co',
      subject: 'OTP VERIFCATION',
      html: `<p> OTP:${otpCode}</p>`,
    };
    const otp = this.otpRepository.create(otpData);
    try {
      await this.mailService.sendMail(emailBody);
      //sendgrid.send(emailBody)
      return await this.otpRepository.save(otp);
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }
  @Cron(CronExpression.EVERY_30_SECONDS)
  private async deleteExpiredOtp() {
    //console.log('running')
    const cutoffDate = new Date(Date.now() - 100000);
    const otp = await this.otpRepository.findOneBy({
      createdAt: LessThanOrEqual(cutoffDate),
    });
    if (otp) {
      return await this.otpRepository.remove(otp);
    }
  }

  async valdiateOtp(email: string, otp: string) {
    const data = await this.otpRepository.findOneBy({ email, otp });
    if (!data) throw new NotFoundException('Invalid Otp');
    return data;
  }
}

//const organization = this.organizationRepository.create(organizationData);
// try {
//     return await this.organizationRepository.save(organization);
