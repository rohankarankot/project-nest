// auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/auth-dto/login-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RegistrationDto } from 'src/common/dto/auth-dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.getUser(req);
  }
}
