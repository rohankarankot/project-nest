import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/common/schema/user.schema';
import { Message } from './message.schema';

@Schema({
  timestamps: true,
})
export class Chat extends Document {
  @Prop({ trim: true })
  chatName: string;

  @Prop({ required: true, default: false })
  isGroupChat: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
  latestMessage: Message;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  groupAdmin: User;
}

export const ChatModel = SchemaFactory.createForClass(Chat);
