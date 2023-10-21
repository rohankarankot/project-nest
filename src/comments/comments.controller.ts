// comments.controller.ts
import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CommentDto } from 'src/common/dto/posts-dto/comment.dto';

@Controller('post/comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //add a comment on post
  @UseGuards(JwtAuthGuard)
  @Post('addComment/:postId')
  async addComment(
    @Param('postId') postId: string,
    @Body() commentDto: CommentDto,
    @Request() req,
  ) {
    const userId = req.user.id;

    const comment = await this.commentsService.addComment(
      postId,
      commentDto,
      userId,
    );

    return comment;
  }

  //fetch all commets of post
  @Post('fetch-comments')
  async getCommentsByIds(
    @Body() request: { comments: string[] },
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    try {
      const comments = await this.commentsService.getCommentsByIds(
        request.comments,
        page,
        limit,
      );
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  //delete comment
  @Delete('deleteComment/:id')
  async deleteComment(@Param('id') commentId: string) {
    try {
      const deletedComment =
        await this.commentsService.deleteComment(commentId);

      if (!deletedComment) {
        return { message: 'Comment not found or already deleted' };
      }

      return { message: 'Comment deleted', deletedComment };
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}
