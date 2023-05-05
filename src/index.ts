import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@apollo/server/express4"
import { UserSource } from "./db/Sources/UserSource.js";
import { ChatSource } from "./db/Sources/ChatSource.js";
import { WebSocketServer } from "ws"
import { useServer } from "graphql-ws/lib/use/ws"
import cors from 'cors'
import bodyParser from 'body-parser'
import express from "express";
import http from 'http'
import config from "../knexfile.js"
import { UserChatSource } from "./db/Sources/UserChatSource.js";
import { MessageSource } from "./db/Sources/MessageSource.js";
import { MainContext } from "./types/Context.js";
import { typeDefs } from "./db/Schema.js";
import { resolvers } from "./resolvers/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { pubsub } from "./resolvers/Subscriptions/Subscriptions.js";

const app = express()

const httpServer = http.createServer(app)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const server = new ApolloServer<MainContext>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanUp.dispose()
          }
        }
      }
    }
  ]
})

const dataSourceConfig = {
  knexConfig: config, 
  writeKnexConfig: config,
  cache: server.cache
}

const dataSources = {
  user: new UserSource(dataSourceConfig),
  chat: new ChatSource(dataSourceConfig),
  userChat: new UserChatSource(dataSourceConfig),
  message: new MessageSource(dataSourceConfig)
}

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})

const serverCleanUp = useServer(
  { 
    schema,
    onConnect: async () => {

    },
    context: async (ctx, msg, args) => {
      const token = ctx.connectionParams.authToken as string || ''

      let user = token ? await dataSources.user.getUserByToken(token) : null

      return { 
        pubsub,
        user 
      }
    }
  }, 
  wsServer
)

await server.start()

app.use(
  '/graphql', 
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, ({ context: async ({req}):Promise<MainContext> => {
    const token = req.headers.authorization || ''

    let user = null

    if (token) {
      const splitToken = token.split("Bearer ")
      if (splitToken && splitToken[1]) {
        user = await dataSources.user.getUserByToken(splitToken[1])
      }
    }

    return {
      dataSources,
      pubsub,
      user
    }
  }}))
)

await new Promise<void>((resolve) => httpServer.listen({port: 4000}, resolve))
  .then(() => {
    console.log(`Server ready at: http://localhost:4000`)
  })

