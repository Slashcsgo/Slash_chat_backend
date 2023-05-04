import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { User } from "../../types/User";
import jwt from "jsonwebtoken"
import { SuccessWithToken, DataNotChanged, UserSuccess, WrongUsernameOrPassword } from "../../helpers/Responces.js";

const jwtSecret = "e5RZ7EwJNtl3Dc6b3JS4tSSw8m4fM0ZRxkmdTCmC/Bs="

export class UserSource extends BatchedSQLDataSource {
  constructor (config: BatchedSQLDataSourceProps) {
    super(config);
  }

  addUser(user: User) {
    return this.db.write('users').insert({
      name: user.name,
      description: user.description,
      email: user.email,
      password: user.password
    }, ['id']).then(() => {
      return {
        success: true,
        error: null
      }
    })
  }

  async login(username: String, password: String, email: String) {
    let user: User[]
    let query = this.db.query<User>('users').select('*')

    if (username) {
      user = await query.where('name', '=', username)
    } else {
      user = await query.where('email', '=', email)
    }
    if (user && user[0] && password === user[0].password) {
      let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ['user'],
          "x-hasura-default-role": 'user',
          "x-hasura-user-id": String(user[0].id)
        }
      }, jwtSecret)
      await this.db.write<User>('users').update({token}).where('id', '=', user[0].id)
      return SuccessWithToken(token)
    } else {
      return WrongUsernameOrPassword
    }
  }

  async getUserByToken(token: String) {
    try {
      let user = await this.db.query<User>('users').select('*').where('token', '=', token)
      if (user && user[0]) {
        return user[0]
      }
    } catch (e) {
      return null
    }
  }

  async modifyUser(
    userId: Number, data: {
      description?: String,
      name?: String
    }
  ) {
    const updatedUser: User[] = await this.db.write<User>('users')
      .where('id', '=', userId).update({...data}, ['*'])

    if (updatedUser && updatedUser.length) {
      return UserSuccess(updatedUser[0])
    } else {
      return DataNotChanged
    }
  }
}