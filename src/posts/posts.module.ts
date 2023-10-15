import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsModel } from 'src/common/schema/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsModel }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
