import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Request,
  Query,
  Put,
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
  @Put('update/:id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto,
    @Request() req,
  ) {
    return this.postService.updatePost(postId, updatePostDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllPost(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req,
  ) {
    return this.postService.getAllPosts(req, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPost(
    @Param('id')
    id: string,
  ): Promise<Posts> {
    return this.postService.findById(id);
  }
}
