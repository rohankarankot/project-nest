import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/common/schema/user.schema';
import { Chat } from './chat.schema';

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  sender: User;
  @Prop({ trim: true })
  content: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Chat' })
  chat: Chat;
}

export const MessageModel = SchemaFactory.createForClass(Message);
