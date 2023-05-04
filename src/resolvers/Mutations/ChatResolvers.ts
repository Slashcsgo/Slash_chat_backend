import { UnauthorizedResponce } from "../../helpers/Responces.js"
import { Chat } from "../../types/Chat.js"
import { MainContext } from "../../types/Context"

export const chatResolvers = {
  addChat: (parent: any, args: {title: String, description?: String}, ctx: MainContext) => {
    if (ctx.user) {
      return ctx.dataSources.chat.addChat({...args}, ctx.user.id, ctx)
    } else {
      return UnauthorizedResponce
    }
  },
  removeChat: (parent: any, args: {id: Number}, ctx: MainContext) => {
    if (ctx.user) {
      return ctx.dataSources.chat.removeChat(args.id, ctx.user.id, ctx)
    } else {
      return UnauthorizedResponce
    }
  },
  modifyChat: (parent: any, args: Chat, ctx: MainContext) => {
    console.log(args)
    if (ctx.user) {
      const updateData: {description?: String, title?: String} = {}
      args.description ? updateData.description = args.description : null
      args.title ? updateData.title = args.title : null

      return ctx.dataSources.chat.modifyChat(args.id, updateData, ctx)
    } else {
      return UnauthorizedResponce
    }
  }
}