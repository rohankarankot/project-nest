import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsModel } from 'src/common/schema/posts.schema';
import { AuthService } from 'src/auth/auth.service';
import { User, UserModel } from 'src/common/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsModel }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService],
})
export class PostsModule {}
