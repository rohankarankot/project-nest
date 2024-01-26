import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatMessagesGateway {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @SubscribeMessage('createChatMessage')
  create(@MessageBody() createChatMessageDto: CreateChatMessageDto) {
    return this.chatMessagesService.create(createChatMessageDto);
  }

  @SubscribeMessage('findAllChatMessages')
  findAll() {
    return this.chatMessagesService.findAll();
  }
  @SubscribeMessage('joinRoom')
  joinRoom() {
    return this.chatMessagesService.joinRoom();
  }

  @SubscribeMessage('typing')
  typing() {
    return this.chatMessagesService.typing();
  }

  // will use later....

  // @SubscribeMessage('findOneChatMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.chatMessagesService.findOne(id);
  // }

  // @SubscribeMessage('updateChatMessage')
  // update(@MessageBody() updateChatMessageDto: UpdateChatMessageDto) {
  //   return this.chatMessagesService.update(
  //     updateChatMessageDto.id,
  //     updateChatMessageDto,
  //   );
  // }

  // @SubscribeMessage('removeChatMessage')
  // remove(@MessageBody() id: number) {
  //   return this.chatMessagesService.remove(id);
  // }
}
