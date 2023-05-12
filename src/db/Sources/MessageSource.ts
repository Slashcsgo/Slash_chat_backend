import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { BadUserInput } from "../../helpers/Errors.js";
import { Message } from "../../types/Message";
import { UserChat } from "../../types/UserChat";

export class MessageSource extends BatchedSQLDataSource {
  constructor (config: BatchedSQLDataSourceProps) {
    super(config)
  }

  async sendMessage(
    chatID: Number, content: String, userID: Number
  ): Promise<Message> {
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
      
      if (insertedMessage.length > 0) {
        return insertedMessage[0]
      } else {
        BadUserInput('chat_id')
      }
    } else {
      return BadUserInput('chat_id')
    }
  }

  async editMessage(
    messageID: Number, content: String, userID: Number
  ): Promise<Message> {
    if (content) {
      const editedMessage = await this.db.write<Message>('messages')
        .update({ content }, '*').where('id', '=', messageID)
        .andWhere('user_id', '=', userID)
      if (editedMessage.length > 0) {
        return editedMessage[0]
      } else {
        BadUserInput('id')
      }
    } else {
      BadUserInput('content')
    }
  }

  async deleteMessage(
    messageID: Number, userID: Number
  ): Promise<Message> {
    const deletedMessage = await this.db.write<Message>('messages')
      .delete('*').where('id', '=', messageID).andWhere('user_id', userID)
    
    if (deletedMessage.length > 0) {
      return deletedMessage[0]
    } else {
      BadUserInput('id')
    }
  }
}