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
  async addComment(postId: string, commentDto: CommentDto, userId: string) {
    try {
      const newComment = new this.commentModel({
        comment: commentDto.comment,
        post: postId,
        user: userId,
      });

      const comment = await newComment.save();
      const post = await this.postModel.findById(postId);

      if (!post) {
        throw new NotFoundException('Post not found');
      }
      post.comments.push(comment._id);
      await post.save();
      return comment;
    } catch (error) {
      this.logger.error('Error adding comment:', error);
    }
  }

  //get all comments of post
  async getCommentsByIds(commentIds: string[], page: number, limit: number) {
    try {
      const skip = (page - 1) * limit; // Calculate the number of documents to skip
      const commentsQuery = this.commentModel.find({
        _id: { $in: commentIds },
      });

      const totalCommentsQuery = commentsQuery.clone(); // Create a clone of the query
      const totalComments = await totalCommentsQuery.countDocuments();

      const comments = await commentsQuery.skip(skip).limit(limit).exec();

      const hasMoreComments = totalComments > skip + comments.length;

      return { comments, hasMoreComments };
    } catch (error) {
      this.logger.error('Error fetching comments by IDs:', error);
      throw error;
    }
  }
}
