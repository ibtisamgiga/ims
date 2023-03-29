import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { Role } from './decorators/user-role.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Roles } from './enums/roles.enum';
import { RolesGuard } from './guards/role.gaurd';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SendOtpDto } from 'src/otp/dtos/send-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('users')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signup')
   @Role(Roles.SuperAdmin, Roles.Admin)
   @UseGuards(AuthGuard(), RolesGuard)
  signUp(@Body() createUserDto:CreateUserDto, @GetUser() user:User) {
    console.log(createUserDto)
    return this.authService.createUser(createUserDto,user);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.validateUserPassowrd(signInDto);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }

  @Role(Roles.SuperAdmin)
  @UseGuards(RolesGuard)
  @Post('/test')
  @UseGuards(AuthGuard())
  async test() {
    /***********iwas here */
  }

  @Get('')
  @Role(Roles.SuperAdmin, Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  getUsers(@GetUser() user: User) {
    return this.userService.getUsers(user);
  }


  @Delete('/:id')
  @Role(Roles.SuperAdmin, Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  deleteTask(@Param('id',ParseIntPipe) id:number,  @GetUser() user:User) {
    return this.userService.deleteUser(id,user)
  }

  @Patch('/:id')
  @Role(Roles.SuperAdmin, Roles.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  updateUser(@Param('id',ParseIntPipe) id: number, @Body() body: UpdateUserDto,@GetUser()user:User ) {
    return this.userService.updateUser(id,body,user)
  }

  @Post('send-otp')
  async sendOtp(@Body()sendOtpDto:SendOtpDto) {
    return await this.userService.sendOtp(sendOtpDto);
  }

  @Put('reset-password')
  async resetPassword(@Body()resetPasswordDto:ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
