import { UserSource } from "../db/Sources/UserSource"
import { ChatSource } from "../db/Sources/ChatSource"
import { UserChatSource } from "../db/Sources/UserChatSource"
import { MessageSource } from "../db/Sources/MessageSource"
import { User } from "./User"
import { PubSub } from "graphql-subscriptions"

export interface MainContext {
  dataSources: {
    user: UserSource
    chat: ChatSource
    userChat: UserChatSource
    message: MessageSource
  },
  pubsub: PubSub,
  user: User | null
}

export interface SubContext {
  pubsub: PubSub,
  user: User | null
}