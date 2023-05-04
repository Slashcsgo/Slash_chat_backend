import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { BadRequest, ChatSuccess, DataNotChanged, Success } from "../../helpers/Responces.js";
import { Chat } from "../../types/Chat";
import { MainContext, SubContext } from "../../types/Context.js";
import { Message } from "../../types/Message.js";
import { User } from "../../types/User.js";
import { UserChat } from "../../types/UserChat";


export class ChatSource extends BatchedSQLDataSource {
  constructor(config: BatchedSQLDataSourceProps) {
    super(config)
  }

  async addChat(chat: Chat, userID: Number, ctx: MainContext) {
    const insertedChat = await this.db.write<Chat>('chats').insert({
      title: chat.title,
      description: chat.description,
      admin_id: userID
    }, ['id', 'description', 'title', 'admin_id'])
    const userChat = await this.db.write<UserChat>('users_chats').insert({
      chat_id: insertedChat[0].id,
      user_id: userID
    }, '*')

    ctx.pubsub.publish("USER_ADDED_TO_CHAT", {
      ...userChat[0],
      chat: insertedChat[0],
      user: ctx.user
    })
    return ChatSuccess(insertedChat[0])
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
      return Success
    } else {
      return BadRequest
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
      console.log("PUBLISHED")
      ctx.pubsub.publish("CHAT_MODIFIED", {
        chat: updatedChat[0],
        users: chatUsers
      })
      return ChatSuccess(updatedChat[0])
    } else {
      return DataNotChanged
    }
  }
}