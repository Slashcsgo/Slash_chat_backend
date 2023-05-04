import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { BadRequest, MessageSuccess, Success } from "../../helpers/Responces.js";
import { Message } from "../../types/Message";
import { UserChat } from "../../types/UserChat";

type MessageResponce = {
  success: boolean,
  error?: {
    message: string,
    code: number
  },
  message?: Message
}

export class MessageSource extends BatchedSQLDataSource {
  constructor (config: BatchedSQLDataSourceProps) {
    super(config)
  }

  async sendMessage(
    chatID: Number, content: String, userID: Number
  ): Promise<MessageResponce> {
    const isUserInChat = await this.db.query<UserChat>('users_chats')
      .where('chat_id', '=', chatID)
      .andWhere('user_id', '=', userID)
    if (isUserInChat.length) {
      const insertedMessage: Message[] = await this.db.write<Message>('messages')
        .insert({
          user_id: userID,
          chat_id: chatID,
          content
        }, ['*'])
      
      return insertedMessage.length > 0 ? MessageSuccess(insertedMessage[0]) : BadRequest
    }
    return BadRequest
  }

  async editMessage(
    messageID: Number, content: String, userID: Number
  ): Promise<MessageResponce> {
    const editedMessage = await this.db.write<Message>('messages')
      .update({ content }, '*').where('id', '=', messageID)
      .andWhere('user_id', '=', userID)
    return editedMessage.length > 0 ? MessageSuccess(editedMessage[0]) : BadRequest
  }

  async deleteMessage(
    messageID: Number, userID: Number
  ): Promise<MessageResponce> {
    const deletedMessage = await this.db.write<Message>('messages')
      .delete('*').where('id', '=', messageID).andWhere('user_id', userID)

    return deletedMessage.length > 0 ? MessageSuccess(deletedMessage[0]) : BadRequest
  }
}