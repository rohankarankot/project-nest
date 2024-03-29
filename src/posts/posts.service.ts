import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PostsDTO } from 'src/common/dto/posts-dto/post.dto';
import { Posts } from 'src/common/schema/posts.schema';
import { User } from 'src/common/schema/user.schema';
import ImageKit from 'imagekit';
import {
  deleteImageFromImageKit,
  uploadImageToImageKit,
} from 'src/utils/imageKit';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private readonly postsModel: Model<Posts>,
    @Inject('ImageKit') private readonly imagekit: ImageKit,
  ) {}

  async addNewPost(postsDTO: PostsDTO, user: User, files) {
    try {
      const fileUploadPromises = files.map(async (file) => {
        return uploadImageToImageKit(this.imagekit, file);
      });

      const fileUrls = await Promise.all(fileUploadPromises);

      postsDTO.image = fileUrls;
      postsDTO.userName = user.firstName;

      const data = Object.assign(
        postsDTO,
        { user: user._id },
        { image: fileUrls },
        { userName: user.firstName },
      );

      const post = new this.postsModel(data);
      await post.save();

      return post;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Posts> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const post = await this.postsModel.findById(id);

    if (!post) {
      throw new NotFoundException('post not found.');
    }

    return post;
  }

  async getAllPosts(request: any, page: number, limit: number) {
    const userId = request.user.id;
    const skip = (page - 1) * limit;
    return {
      data: await this.postsModel
        .find({ user: userId })
        .skip(skip)
        .limit(limit)
        .exec(),
      page,
    };
  }

  async updatePost(id: string, updatePostDto, userId: string): Promise<any> {
    const existingPost = await this.postsModel.findById(id).exec();

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    if (existingPost.user.toString() !== userId) {
      throw new NotAcceptableException('You are not the owner of this post');
    }

    // Determine which fields are updated
    const updatedFields = {};
    if (updatePostDto.caption !== undefined) {
      updatedFields['caption'] = updatePostDto.caption;
    }
    if (updatePostDto.image !== undefined) {
      updatedFields['image'] = updatePostDto.image;
    }
    if (updatePostDto.category !== undefined) {
      updatedFields['category'] = updatePostDto.category;
    }

    // Update only the changed fields
    const updatedPost = await this.postsModel
      .findByIdAndUpdate(id, updatedFields, { new: true })
      .exec();
    return updatedPost;
  }

  async deletePost(id: string): Promise<{ msg: string }> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const post = await this.postsModel.findById(id);

    if (!post) {
      throw new NotFoundException('post not found.');
    } else {
      const fileUploadPromises = post.image.map(async (file: any) => {
        return await deleteImageFromImageKit(this.imagekit, file.fileId);
      });

      await Promise.all(fileUploadPromises);

      await this.postsModel.findByIdAndDelete(id).exec();
      return { msg: 'post deleted sucessfully' };
    }
  }

  async getAllPostByCity(page: number = 1, limit: number = 10, city: string) {
    // Check if the 'city' parameter is provided
    if (!city) {
      throw new HttpException(
        'City parameter is required.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Calculate the number of documents to skip based on the current page and limit
    const skip = (page - 1) * limit;

    // Query the database to find posts matching the specified city, skip the calculated number, and limit the result
    const result = await this.postsModel
      .find({ city })
      .skip(skip)
      .limit(limit)
      .exec();

    // Return the result as an object with data and page properties
    return {
      data: result,
      page,
    };
  }
}
