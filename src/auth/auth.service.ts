import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../common/dto/auth-dto/login-user.dto';
import { RegistrationDto } from 'src/common/dto/auth-dto/register-user.dto';

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    registrationDto: RegistrationDto,
  ): Promise<{ token: string }> {
    try {
      const existingUser = await this.userModel.findOne({
        email: registrationDto.email,
      });

      if (existingUser) {
        throw new NotFoundException('User with this email already exists.');
      }

      const hashedPassword = await bcrypt.hash(registrationDto.password, 10);

      const user = new this.userModel({
        ...registrationDto,
        password: hashedPassword,
        deactivated: false,
      });
      const token = this.jwtService.sign({
        id: user._id,
      });
      await user.save();

      return { token };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Re-throw the error to propagate it to the controller
    }
  }

  async loginUser(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    try {
      const user = await this.userModel.findOne({
        email,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      if (user.deactivated) {
        await this.userModel.findByIdAndUpdate(
          user._id,
          { deactivated: false },
          { new: true },
        );
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid username or password');
      }
      const token = this.jwtService.sign({
        id: user._id,
      });

      return { token };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
