import { UnauthorizedResponce } from "../../helpers/Responces.js"
import { MainContext } from "../../types/Context"

export const messageResolvers = {
  sendMessage: async (parent: any, args: {chat_id: Number, content: String}, ctx: MainContext) => {
    if (ctx.user) {
      const result = await ctx.dataSources.message.sendMessage(
        args.chat_id, args.content, ctx.user.id
      )
      if (result.message) {
        ctx.pubsub.publish(
          "MESSAGE_CREATED", 
          {
            ...result.message,
            user: {
              id: ctx.user.id,
              description: ctx.user.description,
              name: ctx.user.name,
              email: ctx.user.email
            }
          }
        )
      }
      return result
    } else {
      return UnauthorizedResponce
    }
  },
  editMessage: async (parent: any, args: {id: Number, content: String}, ctx: MainContext) => {
    if (ctx.user) {
      const result = await ctx.dataSources.message.editMessage(
        args.id, args.content, ctx.user.id
      )
      if (result.message) {
        ctx.pubsub.publish(
          "MESSAGE_EDITED",
          {
            ...result.message,
            user: {
              id: ctx.user.id,
              description: ctx.user.description,
              name: ctx.user.name,
              email: ctx.user.email
            }
          }
        )
      }
      return result
    } else {
      return UnauthorizedResponce
    }
  },
  deleteMessage: async (parent: any, args: {id: Number}, ctx: MainContext) => {
    if (ctx.user) {
      const result = await ctx.dataSources.message
        .deleteMessage(args.id, ctx.user.id)
      if (result.message) {
        ctx.pubsub.publish(
          "MESSAGE_DELETED",
          {
            ...result.message,
            user: {
              id: ctx.user.id,
              description: ctx.user.description,
              name: ctx.user.name,
              email: ctx.user.email
            }
          }
        )
      }
      return result
    } else {
      return UnauthorizedResponce
    }
  }
}