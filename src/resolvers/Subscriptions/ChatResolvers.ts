import { withFilter } from "graphql-subscriptions";
import { Chat } from "../../types/Chat";
import { SubContext } from "../../types/Context";

const filter = (
  payload: {
    users: Number[],
    chat: Chat
  },
  _variables,
  ctx: SubContext
) => {
  return payload.users.includes(ctx.user.id)
}

const resolve = (payload) => payload.chat

const subscribeFn = (triggers: string[]) => withFilter(
  (_root, _args, ctx: SubContext) => {
    if (!ctx.user) throw new Error("Unauthorized")
    return ctx.pubsub.asyncIterator(triggers)
  },
  filter
)

export const ChatResolvers = {
  chatAdded: {
    subscribe: subscribeFn(["CHAT_ADDED"]),
    resolve
  },
  chatRemoved: {
    subscribe: subscribeFn(["CHAT_REMOVED"]),
    resolve
  },
  chatModified: {
    subscribe: subscribeFn(["CHAT_MODIFIED"]),
    resolve
  }
}