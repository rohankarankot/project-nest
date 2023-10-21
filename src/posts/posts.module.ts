import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsModel } from 'src/common/schema/posts.schema';
import { AuthService } from 'src/auth/auth.service';
import { User, UserModel } from 'src/common/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsController } from 'src/comments/comments.controller';
import { Comment, CommentModel } from 'src/common/schema/post-comment.schema';

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
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentModel }]),
  ],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, AuthService, CommentsService],
})
export class PostsModule {}
