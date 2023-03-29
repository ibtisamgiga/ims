import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { OtpService } from 'src/otp/otp.service';
import { SendOtpDto } from 'src/otp/dtos/send-otp.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private otpService: OtpService,
  ) {}

  async getUsers(user: User) {
    const searchRole = user.role == 'superadmin' ? 'admin' : 'employee';
    if (user.role == 'admin') {
      const users = await this.userRepository.find({
        where: { role: searchRole, organizationId: user.organizationId },
        relations: {
          organization: true,
        },
      });
      return users;
    }
    const users = await this.userRepository.find({
      where: { role: searchRole },
      relations: {
        organization: true,
      },
    });
    return users;
  }

  async deleteUser(id: number, currentUser: User) {
    const role = currentUser.role == 'superadmin' ? 'admin' : 'employee';
    const user = await this.userRepository.findOneBy({ id, role });
    if (!user) throw new NotFoundException('user Not Found');
    return {
      user: await this.userRepository.remove(user),
      message: 'User Deleted',
    };
  }

  

  async updateUser(id: number, attrs: UpdateUserDto, currentUser: User) {
    const role = currentUser.role == 'superadmin' ? 'admin' : 'employee';
    const user = await this.userRepository.findOneBy({ id, role });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    Object.assign(user, attrs);
    return {
      user: await this.userRepository.save(user),
      message: 'User Updated',
    };
  }

  async findUserByemail(email: string) {
    console.log(email, 'user');
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  // resetPassword(resetPasswordDto) {
  //   this.otpService.valdiateOtp(resetPasswordDto);
  // }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { email } = sendOtpDto;
    const user = await this.findUserByemail(email);
    if (!user) throw new NotFoundException('user Not found');
    return await this.otpService.sendOtp(sendOtpDto);
  }
}
