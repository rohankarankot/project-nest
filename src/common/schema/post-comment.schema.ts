import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Comment extends Document {
  @Prop({ required: true })
  comment: string;

  @IsOptional()
  @Prop()
  userName: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId;
}

export const CommentModel = SchemaFactory.createForClass(Comment);
