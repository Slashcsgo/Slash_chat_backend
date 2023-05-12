import { Unauthorized } from "../../helpers/Errors.js"
import { MainContext } from "../../types/Context"

export const userChatResolvers = {
  addUserToChat: (parent: any, args: {user_id: Number, chat_id: Number}, ctx: MainContext) => {
    if (!ctx.user) Unauthorized()
    return ctx.dataSources.userChat.addUserToChat(args.user_id, args.chat_id, ctx.user.id, ctx)
  },
  removeUserFromChat: (parent: any, args: {chat_id: Number, user_id: Number}, ctx: MainContext) => {
    if (!ctx.user) Unauthorized()
    return ctx.dataSources.userChat.removeUserFromChat(args.user_id, args.chat_id, ctx.user.id, ctx)
  },
  quitChat: (parent: any, args: {chat_id: Number}, ctx: MainContext) => {
    if (!ctx.user) Unauthorized() 
    return ctx.dataSources.userChat.removeUserFromChat(ctx.user.id, args.chat_id, ctx.user.id, ctx)
  }
}