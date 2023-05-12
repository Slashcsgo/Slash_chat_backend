import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { BadUserInput } from "../../helpers/Errors.js";
import { Chat } from "../../types/Chat";
import { MainContext } from "../../types/Context.js";
import { Message } from "../../types/Message.js";
import { User } from "../../types/User.js";
import { UserChat } from "../../types/UserChat";

export class UserChatSource extends BatchedSQLDataSource {
  constructor(config: BatchedSQLDataSourceProps) {
    super(config)
  }

  async addUserToChat(userToAdd: Number, chatID: Number, userID: Number, ctx: MainContext) {
    const invitingUserInChat = await this.db.query<UserChat>('users_chats')
      .select('*')
      .where('user_id', '=', userID)
      .andWhere('chat_id', '=', chatID)

    if (invitingUserInChat.length) {
      const userToAddInChat = await this.db.query<UserChat>('users_chats')
        .select('*')
        .where('user_id', '=', userToAdd)
        .andWhere('chat_id', '=', chatID)
      if (userToAddInChat.length === 0) {
        await this.db.write<UserChat>('users_chats')
          .insert({ user_id: userToAdd, chat_id: chatID }, ['id'])

        const chats: Chat[] = await this.db.query<Chat>('chats')
          .select('*')
          .where('id', '=', chatID)

        const users: User[] = await this.db.query<User>('users')
          .select('*')
          .where('id', '=', userToAdd)
        
        ctx.pubsub.publish("USER_ADDED_TO_CHAT", {
          chat_id: chatID,
          user: users[0]
        })

        ctx.pubsub.publish("CHAT_ADDED", {
          users: [userToAdd],
          chat: chats[0]
        })
        
        return userToAdd
      } else {
        BadUserInput('user_id')
      }
    } else {
      BadUserInput('chat_id')
    }
  }

  async removeUserFromChat(userToRemove: Number, chatID: Number, userID: Number, ctx: MainContext) {
    // Выбираем чат, из которого нужно удалить
    const chat: Chat[] = await this.db.query<Chat>('chats').select('*').where('id', '=', chatID)

    if (chat) {
      const simpleUserRemove = async () => {
        const deletedUsers = await this.db.write<UserChat>('users_chats').delete('*')
          .where('user_id', '=', userToRemove)
          .andWhere('chat_id', '=', chatID)
  
        const users = await this.db.query<User>('users').select('*')
          .where('id', '=', userToRemove)
  
        if (deletedUsers.length > 0) {
          ctx.pubsub.publish("USER_REMOVED_FROM_CHAT", {
            chat_id: chatID,
            user: users[0]
          })
          ctx.pubsub.publish("CHAT_REMOVED", {
            users: [userToRemove],
            chat: chat[0]
          })
          return userToRemove
        } else {
          BadUserInput(['user_id', 'chat_id'])
        }
      }
      // Если инициатор мутации является админом чата, разрешаем удаление
      if (chat[0].admin_id === userID) {
        // Если инициатор пытается удалить себя, то удаляем чат
        if (userToRemove === userID) {
          // Поскольку мы уже получили чат и админом является инициатор, то нет смысла проверять
          // удалился ли чат
          const userChats: UserChat[] = await this.db.write<UserChat>('users_chats').delete('*')
            .where('chat_id', '=', chatID)
          await this.db.write<Message>('messages').delete('*')
            .where('chat_id', '=', chatID)
          const chats: Chat[] = await this.db.write<Chat>('chats').delete("*")
            .where('id', '=', chatID)
  
          ctx.pubsub.publish("CHAT_REMOVED", {
            users: userChats.map(e => e.user_id),
            chat: chats[0]
          })
  
          return userToRemove
        } else {
          return await simpleUserRemove()
        }
      } else if (userToRemove === userID) {
        return await simpleUserRemove()
      } else {
        BadUserInput('chat_id')
      }
    } else {
      BadUserInput('chat_id')
    }
  }
}