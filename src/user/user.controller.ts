import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UpdateProfileDto } from 'src/common/dto/auth-dto/register-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('UserApi')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getUser(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(
    @Body() updateProfile: Partial<UpdateProfileDto>,
    @Req() req,
  ) {
    return this.userService.updateProfile(updateProfile, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Put('deactivate')
  async deactivateProfile(@Req() req) {
    return this.userService.deactivateProfile(req.user);
  }
}
