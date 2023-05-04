import { chatResolvers } from "./ChatResolvers.js";
import { messageResolvers } from "./MessageResolvers.js";
import { userChatResolvers } from "./UserChatResolvers.js";
import { userResolvers } from "./UserResolvers.js";

export const mutations = {
  ...chatResolvers,
  ...messageResolvers,
  ...userChatResolvers,
  ...userResolvers
}