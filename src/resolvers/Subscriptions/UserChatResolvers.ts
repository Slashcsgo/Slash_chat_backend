import { withFilter } from "graphql-subscriptions";
import { Unauthorized } from "../../helpers/Errors.js";
import { SubContext } from "../../types/Context";

const filter = (payload, variables) => {
  return payload.chat_id === variables.chatId
}

const resolve = (payload) => payload.user

const subscribeFn = (triggers: string[]) => withFilter(
  (_root, _args, ctx: SubContext) => {
    if (!ctx.user) Unauthorized()
    return ctx.pubsub.asyncIterator(triggers)
  },
  filter
)

export const userChatResolvers = {
  userAddedToChat: {
    subscribe: subscribeFn(["USER_ADDED_TO_CHAT"]),
    resolve
  },
  userRemovedFromChat: {
    subscribe: subscribeFn(["USER_REMOVED_FROM_CHAT"]),
    resolve
  }
}