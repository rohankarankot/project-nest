import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsObject,
  IsString,
} from 'class-validator';

export class ChatMessageDTO {
  @IsString()
  chatName: string;

  @IsBoolean()
  isGroupChat: boolean = false;

  @IsArray()
  @IsMongoId({ each: true })
  users: string[];

  @IsMongoId()
  latestMessage: string;
}
