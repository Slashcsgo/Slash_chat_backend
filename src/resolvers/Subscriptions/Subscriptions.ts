import { PubSub } from "graphql-subscriptions"
import { ChatResolvers } from "./ChatResolvers.js"
import { messageResolvers } from "./MessageResolvers.js"
import { userChatResolvers } from "./UserChatResolvers.js"

export const pubsub = new PubSub()

export const subscriptions = {
  ...messageResolvers,
  ...userChatResolvers,
  ...ChatResolvers
}