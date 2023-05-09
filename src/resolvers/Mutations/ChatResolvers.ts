import { Unauthorized } from "../../helpers/Errors.js"
import { UnauthorizedResponce } from "../../helpers/Responces.js"
import { Chat } from "../../types/Chat.js"
import { MainContext } from "../../types/Context"

export const chatResolvers = {
  addChat: (parent: any, args: {title: String, description?: String}, ctx: MainContext) => {
    if (!ctx.user) Unauthorized() 
    return ctx.dataSources.chat.addChat({...args}, ctx.user.id, ctx)
  },
  removeChat: (parent: any, args: {id: Number}, ctx: MainContext) => {
    if (ctx.user) Unauthorized()
    return ctx.dataSources.chat.removeChat(args.id, ctx.user.id, ctx)
  },
  modifyChat: (parent: any, args: Chat, ctx: MainContext) => {
    if (!ctx.user) Unauthorized()
    const updateData: {description?: String, title?: String} = {}
    args.description ? updateData.description = args.description : null
    args.title ? updateData.title = args.title : null

    return ctx.dataSources.chat.modifyChat(args.id, updateData, ctx)
  }
}