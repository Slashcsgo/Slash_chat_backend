import { UnauthorizedResponce } from "../../helpers/Responces.js"
import { MainContext } from "../../types/Context"
import { User } from "../../types/User"

export const userResolvers = {
  addUser: (parent: any, args: User, ctx: MainContext) => {
    return ctx.dataSources.user.addUser({...args})
  },
  login: (
    parent: any, 
    args: {username?: String, password: String, email?: String}, 
    ctx: MainContext
  ) => {
    return ctx.dataSources.user.login(args.username, args.password, args.email)
  },
  modifyUser: (parent: any, args: User, ctx: MainContext) => {
    if (ctx.user) {
      const updateData: {description?: String, name?: String} = {}
      args.description ? updateData.description = args.description : null
      args.name ? updateData.name = args.name : null

      return ctx.dataSources.user.modifyUser(ctx.user.id, updateData)
    } else {
      return UnauthorizedResponce
    }
  }
}