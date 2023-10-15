import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsDTO } from 'src/common/dto/posts-dto/post.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Posts } from 'src/common/schema/posts.schema';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addNewPost(@Body() postsDTO: PostsDTO, @Req() req): Promise<Posts> {
    return this.postService.addNewPost(postsDTO, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Posts> {
    return this.postService.findById(id);
  }
}
