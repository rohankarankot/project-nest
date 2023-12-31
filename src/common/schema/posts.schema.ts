import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Posts & Document;
export enum Category {
  ADVENTURE = 'Adventure',
  CLASSIC = 'Classic',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Schema({
  timestamps: true,
})
export class Posts extends Document {
  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string[];

  @Prop({ required: true })
  category: Category;

  @Prop({ required: true })
  mobile: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  userName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments: Types.ObjectId[];
}

export const PostsModel = SchemaFactory.createForClass(Posts);
