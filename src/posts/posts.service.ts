import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostsDTO } from 'src/common/dto/posts-dto/post.dto';
import { Posts } from 'src/common/schema/posts.schema';
import { User } from 'src/common/schema/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
  ) {}

  async addNewPost(postsDTO: PostsDTO, user: User) {
    try {
      const data = Object.assign(postsDTO, { user: user._id });
      const post = new this.postsModel(data);

      await post.save();

      return post;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Posts> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const book = await this.postsModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }
}
