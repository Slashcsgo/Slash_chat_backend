import { mutations } from "./Mutations/Mutations.js"
import { subscriptions } from "./Subscriptions/Subscriptions.js"

export const resolvers = {
  Mutation: mutations,
  Subscription: subscriptions
}