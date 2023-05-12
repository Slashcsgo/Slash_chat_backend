import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { GraphQLError } from "graphql";
import { Chat } from "../../types/Chat";
import { MainContext} from "../../types/Context.js";
import { Message } from "../../types/Message.js";
import { User } from "../../types/User.js";
import { UserChat } from "../../types/UserChat";
import { ApolloServerErrorCode } from "@apollo/server/errors"
import { BadUserInput } from "../../helpers/Errors.js";


export class ChatSource extends BatchedSQLDataSource {
  constructor(config: BatchedSQLDataSourceProps) {
    super(config)
  }

  async addChat(chat: Chat, userID: Number, ctx: MainContext) {
    if (chat.title) {
      const insertedChat = await this.db.write<Chat>('chats').insert({
        title: chat.title,
        description: chat.description,
        admin_id: userID
      }, ['id', 'description', 'title', 'admin_id'])
      const userChat = await this.db.write<UserChat>('users_chats').insert({
        chat_id: insertedChat[0].id,
        user_id: userID
      }, '*')
  
      ctx.pubsub.publish("CHAT_ADDED", {
        chat: insertedChat[0],
        users: [userID]
      })
      ctx.pubsub.publish("USER_ADDED_TO_CHAT", {
        ...userChat[0],
        chat: insertedChat[0],
        user: ctx.user
      })
      return insertedChat[0]
    } else {
      BadUserInput('chat.title')
    }
  }
  async removeChat(id: Number, userID: Number, ctx: MainContext) {
    const userChat = await this.db.write<UserChat>('users_chats').delete('*')
      .where('chat_id', '=', id)
    await this.db.write<Message>('messages').delete('*')
      .where('chat_id', '=', id)
    const deletedChats = await this.db.write<Chat>('chats').delete("*")
      .where('id', '=', id)
      .andWhere('admin_id', '=', userID)
    if (deletedChats.length > 0) {
      ctx.pubsub.publish("USER_REMOVED_FROM_CHAT", {
        ...userChat[0],
        chat: deletedChats[0],
        user: ctx.user
      })
      ctx.pubsub.publish("CHAT_REMOVED", {
        chat: deletedChats[0],
        users: userChat.map(e => e.user_id)
      })
      return deletedChats[0]
    } else {
      BadUserInput('id')
    }
  }

  async modifyChat(
    chatId: Number, data: {
      description?: String,
      name?: String
    },
    ctx: MainContext
  ) {
    const updatedChat: Chat[] = await this.db.write<Chat>('chats')
      .where('id', '=', chatId).update({...data}, ['*'])

    const chatUsers = (
      await this.db.query<User>('users')
        .select('users.id')
        .join('users_chats', function() {
          this.on('users.id', '=', 'users_chats.user_id')
        })
        .where('users_chats.chat_id', '=', chatId)
    ).map(element => element.id)

    if (updatedChat && updatedChat.length) {
      ctx.pubsub.publish("CHAT_MODIFIED", {
        chat: updatedChat[0],
        users: chatUsers
      })
      return updatedChat[0]
    } else {
      throw new GraphQLError('Unspecified error occured', {
        extensions: {
          code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR
        }
      })
    }
  }
}