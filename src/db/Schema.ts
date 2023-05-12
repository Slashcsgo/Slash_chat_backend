export const typeDefs = `#graphql
  scalar Date

  type user {
    id: ID,
    name: String,
    email: String,
    password: String,
    description: String
  }
  
  type chats {
    id: ID,
    title: String,
    description: String,
    admin_id: ID
  }

  type messages {
    id: ID,
    user: user,
    chat: chats,
    chat_id: ID,
    content: String,
    created_at: Date
  }

  type userchat {
    id: ID,
    user: user,
    chat: chats,
  }

  type Query {
    user: user
  }

  type Subscription {
    messageCreated(chatId: Int!): messages
    messageEdited(chatId: Int!): messages
    messageDeleted(chatId: Int!): messages

    userAddedToChat(chatId: Int!): user
    userRemovedFromChat(chatId: Int!): user

    chatAdded: chats
    chatRemoved: chats
    chatModified: chats
  }

  type Mutation {
    addUser(name: String!, description: String, email: String!, password: String!): Int!
    modifyUser(description: String, name: String): user!
    login(username: String, email: String, password: String!): String!

    addChat(title: String!, description: String): chats!
    removeChat(id: Int!): chats!
    modifyChat(id: Int!, description: String, title: String): chats!

    addUserToChat(user_id: Int!, chat_id: Int!): Int!
    removeUserFromChat(chat_id: Int!, user_id: Int!): Int!
    quitChat(chat_id: Int!): Int!

    sendMessage(chat_id: Int!, content: String!): messages!
    editMessage(id: Int!, content: String!): messages!
    deleteMessage(id: Int!): messages!
  }
`