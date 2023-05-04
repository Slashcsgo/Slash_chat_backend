export const typeDefs = `#graphql
  scalar Date

  type Error {
    message: String!,
    code: Int!,
  }

  interface Responce {
    success: Boolean!,
    error: Error,
  }

  type NoBodyResponce implements Responce {
    success: Boolean!,
    error: Error
  }

  type MessageResponce implements Responce {
    success: Boolean!,
    error: Error,
    message: Message
  }

  type UserResponce implements Responce {
    success: Boolean!,
    error: Error,
    user: User
  }

  type ChatResponce implements Responce {
    success: Boolean!,
    error: Error,
    chat: Chat
  }

  type LoginResponce implements Responce {
    success: Boolean!,
    error: Error,
    token: String
  }

  type User {
    id: ID,
    name: String,
    email: String,
    password: String,
    description: String
  }
  
  type Chat {
    id: ID,
    title: String,
    description: String,
  }

  type Message {
    id: ID,
    user: User,
    chat: Chat,
    chat_id: ID,
    content: String,
    created_at: Date
  }

  type UserChat {
    id: ID,
    user: User,
    chat: Chat,
  }

  type Query {
    user: User
  }

  type Subscription {
    messageCreated(chatId: Int!): Message
    messageEdited(chatId: Int!): Message
    messageDeleted(chatId: Int!): Message

    userAddedToChat(chatId: Int!): User
    userRemovedFromChat(chatId: Int!): User

    chatAdded: Chat
    chatRemoved: Chat
    chatModified: Chat
  }

  type Mutation {
    addUser(name: String!, description: String, email: String!, password: String!): NoBodyResponce!
    modifyUser(description: String, name: String): UserResponce!
    login(username: String, email: String, password: String!): LoginResponce!

    addChat(title: String!, description: String): ChatResponce!
    removeChat(id: Int!): NoBodyResponce!
    modifyChat(id: Int!, description: String, title: String): ChatResponce!

    addUserToChat(user_id: Int!, chat_id: Int!): NoBodyResponce!
    removeUserFromChat(chat_id: Int!, user_id: Int!): NoBodyResponce!
    quitChat(chat_id: Int!): NoBodyResponce!

    sendMessage(chat_id: Int!, content: String!): MessageResponce!
    editMessage(id: Int!, content: String!): MessageResponce!
    deleteMessage(id: Int!): MessageResponce!
  }
`