import { withFilter } from "graphql-subscriptions"
import { Unauthorized } from "../../helpers/Errors.js"
import { SubContext } from "../../types/Context"

const filter = (payload, variables) => 
  payload.chat_id === variables.chatId

const resolve = (payload) => payload

const subscribeFn = (triggers: string[]) => withFilter(
  (_root, _args, ctx: SubContext) => {
    if (!ctx.user) Unauthorized()
    return ctx.pubsub.asyncIterator(triggers)
  },
  filter
)

export const messageResolvers = {
  messageCreated: {
    subscribe: subscribeFn(["MESSAGE_CREATED"]),
    resolve
  },
  messageEdited: {
    subscribe: subscribeFn(["MESSAGE_EDITED"]),
    resolve
  },
  messageDeleted: {
    subscribe: subscribeFn(["MESSAGE_DELETED"]),
    resolve
  }
}