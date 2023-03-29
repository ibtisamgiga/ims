import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInDto } from './dtos/sign-in.dto';
import { GetUser } from './decorators/get-user.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpService } from 'src/otp/otp.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailerService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  /**********************SIGN-UP***********************************/
  async createUser(userData: CreateUserDto, @GetUser() currentuser: User) {
    const { name, email, password, privateEmail, contactNo, organizationId } =
      userData;
    let orgId = organizationId;
    // console.log(organizationId,orgId)
    // console.log(orgId,organizationId,'id')
    const salt = await bcrypt.genSalt(); //gen salt
    const hashedPassword = await this.hashPassword(password, salt); //hasing password recvied from body
    let role = '';
    if (currentuser.role == 'superadmin') {
      role = 'admin';
    } else if (currentuser.role == 'admin') {
      role = 'employee';
      orgId = currentuser.organizationId;
    }
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      privateEmail,
      role,
      contactNo,
      organizationId: orgId,
    }); //creating instance of user before saving to DB
    const emailBody = {
      to: privateEmail,
      from: 'm.ibtisam@gigalabs.co',
      subject: 'Hurray you are registered!!!',
      html: `<p> Email:${user.email}</p><p> Password:${password}</p>`,
    };
    try {
      await this.mailService.sendMail(emailBody);
      return await this.userRepository.save(user); //saving user
    } catch (error) {
      //checking if user email or private email is unique or not
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        // throw any other error
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  /********************************VALIDATE PASSWORD FUNCTION************************************/
  async validateUserPassowrd(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user && (await user.validatePassword(password))) {
      const payLoad = { email };
      const accessToken = await this.jwtService.sign(payLoad);
      return { accessToken, user };
    } else {
      return null;
    }
  }
  /********************************reset pasword*******************/
async resetPassword(resetPasswordDto:ResetPasswordDto){
  const{email,otp,password}=resetPasswordDto
   const data=await this.otpService.valdiateOtp(email,otp)
   if(data){
    const currentTime = new Date().getTime() 
    let diff=data.expiresIn-currentTime
    if(diff<0)throw new BadRequestException('OTP EXPIRED')
   const user= await this.userRepository.findOne({ where: { email } });
   const salt = await bcrypt.genSalt(); //gen salt
    const hashedPassword = await this.hashPassword(password, salt); //hasing password recvied from body
   user.password = hashedPassword;
    return {user:await this.userRepository.save(user) ,message:'password rest'}
  
   }

}

  /***************************************PRIVATE FUNCTION TO HASH PASSWORD**********************/
  private async hashPassword(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
