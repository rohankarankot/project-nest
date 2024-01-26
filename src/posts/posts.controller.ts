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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsDTO } from 'src/common/dto/posts-dto/post.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Posts } from 'src/common/schema/posts.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Delete } from '@nestjs/common/decorators';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UseInterceptors(FilesInterceptor('image'))
  async addNewPost(
    @Body() postsDTO: PostsDTO,
    @Req() req,
    @UploadedFiles(
      new ParseFilePipe({
        // validators: [new MaxFileSizeValidator({ maxSize: 20000 })],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<Posts> {
    return await this.postService.addNewPost(postsDTO, req.user, files);
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

  @Get('city/all')
  async getAllPostByCity(
    @Query('page') page: number,
    @Query('city') city: string,
    @Query('limit') limit: number,
  ) {
    return this.postService.getAllPostByCity(page, limit, city);
  }

  //find post by search
  @Get('search')
  async searchPost(
    @Query('page') page: number,
    @Query('query') query: string,
    @Query('limit') limit: number,
  ) {
    return this.postService.searchPost(query, page, limit);
  }

  //find post by id
  @Get(':id')
  async getPost(
    @Param('id')
    id: string,
  ): Promise<Posts> {
    return this.postService.findById(id);
  }

  // delete post by id
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deletePost(
    @Param('id')
    id: string,
  ): Promise<{ msg: string }> {
    return this.postService.deletePost(id);
  }
}
