import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../common/schema/user.schema';
import { UpdateProfileDto } from 'src/common/dto/auth-dto/register-user.dto';
import {
  BadRequestException,
  NotAcceptableException,
} from '@nestjs/common/exceptions';

@Injectable({})
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUser(request) {
    const userId = request.user.id;
    const user = await this.userModel.findById(userId);
    const { password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  }

  async updateProfile(updateProfile: UpdateProfileDto, user: User) {
    try {
      const existingUser = await this.userModel.findOne({
        email: updateProfile.email,
      });
      const updateObject = {} as Partial<UpdateProfileDto>;

      if (!existingUser) {
        throw new BadRequestException('User not found');
      } else if (!existingUser?._id.equals(user._id)) {
        throw new NotAcceptableException(
          'This email is associated with another user, please use new email',
        );
      }

      if (updateProfile.email !== existingUser.email) {
        updateObject.email = updateProfile.email;
      }

      if (updateProfile.password !== existingUser.password) {
        const hashedPassword = await bcrypt.hash(updateProfile.password, 10);
        updateObject.password = hashedPassword;
      }

      if (updateProfile.firstName !== existingUser.firstName) {
        updateObject.firstName = updateProfile.firstName;
      }

      if (updateProfile.lastName !== existingUser.lastName) {
        updateObject.lastName = updateProfile.lastName;
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(
        existingUser._id,
        updateObject,
        {
          new: true,
        },
      );

      if (!updatedUser) {
        throw new BadRequestException('User update failed');
      }
      const { password, _id, __v, ...userWithoutPassword } =
        updatedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deactivateProfile(user: User) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { deactivated: true },
        { new: true },
      );

      if (!updatedUser) {
        throw new BadRequestException('User update failed');
      } else {
        return { msg: 'Deactivated your Profile' };
      }
    } catch (error) {
      console.error('Error deactivating user profile:', error);
      throw error;
    }
  }
}
