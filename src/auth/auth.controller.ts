// auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/auth-dto/login-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  RegistrationDto,
  UpdateProfileDto,
} from 'src/common/dto/auth-dto/register-user.dto';
import { Req } from '@nestjs/common/decorators';
import { ProfileService } from './profile.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('register')
  async register(
    @Body() registrationDto: RegistrationDto,
  ): Promise<{ token: string }> {
    return this.authService.registerUser(registrationDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.profileService.getUser(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(
    @Body() updateProfile: Partial<UpdateProfileDto>,
    @Req() req,
  ) {
    return this.profileService.updateProfile(updateProfile, req.user);
  }
}
