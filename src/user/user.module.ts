// user/user.module.ts

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from '../common/schema/user.schema';
import { UserController } from './user.controller';
import { UserCleanupService } from './user-cleanup.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserCleanupService],
  exports: [UserService],
})
export class UserModule {}
