export const typeDefs = `#graphql
  scalar Date

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
    addUser(name: String!, description: String, email: String!, password: String!): Int!
    modifyUser(description: String, name: String): User!
    login(username: String, email: String, password: String!): String!

    addChat(title: String!, description: String): Chat!
    removeChat(id: Int!): Chat!
    modifyChat(id: Int!, description: String, title: String): Chat!

    addUserToChat(user_id: Int!, chat_id: Int!): Int!
    removeUserFromChat(chat_id: Int!, user_id: Int!): Int!
    quitChat(chat_id: Int!): Int!

    sendMessage(chat_id: Int!, content: String!): Message!
    editMessage(id: Int!, content: String!): Message!
    deleteMessage(id: Int!): Message!
  }
`