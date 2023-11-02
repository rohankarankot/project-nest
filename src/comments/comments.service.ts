// comments.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDto } from 'src/common/dto/posts-dto/comment.dto';
import { Comment } from 'src/common/schema/post-comment.schema';
import { Posts } from 'src/common/schema/posts.schema';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Posts.name) private postModel: Model<Posts>,
  ) {}

  // add a comment on post
  async addComment(postId: string, commentDto: CommentDto, user) {
    try {
      const post = await this.postModel.findById(postId);

      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const newComment = new this.commentModel({
        comment: commentDto.comment,
        post: postId,
        user: user.userId,
        userName: user.firstName,
      });

      const comment = await newComment.save();

      post.comments.push(comment._id);
      await post.save();
      return comment;
    } catch (error) {
      this.logger.error('Error adding comment:', error);
    }
  }

  async getComments(postId: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return {
      data: await this.commentModel
        .find({ post: postId })
        .skip(skip)
        .limit(limit)
        .exec(),
      page,
    };
  }

  // delete comment
  async deleteComment(commentId: string) {
    try {
      const deletedComment =
        await this.commentModel.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return null;
      }

      return deletedComment;
    } catch (error) {
      throw error;
    }
  }

  // edit comment
  async editComment(commentId: string, updateCommentDto) {
    try {
      const existingComment = await this.commentModel.findById(commentId);

      if (!existingComment) {
        return null;
      }

      existingComment.comment = updateCommentDto.comment;

      const updatedComment = await existingComment.save();

      return updatedComment;
    } catch (error) {
      throw error;
    }
  }
}
