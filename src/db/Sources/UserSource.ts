import { BatchedSQLDataSource, BatchedSQLDataSourceProps } from "@nic-jennings/sql-datasource";
import { User } from "../../types/User";
import jwt from "jsonwebtoken"
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors"
import { BadUserInput } from "../../helpers/Errors.js";

const jwtSecret = "e5RZ7EwJNtl3Dc6b3JS4tSSw8m4fM0ZRxkmdTCmC/Bs="

export class UserSource extends BatchedSQLDataSource {
  constructor (config: BatchedSQLDataSourceProps) {
    super(config);
  }

  async addUser(user: User) {
    const addedUser: User[] = await this.db.write<User>('users').insert({
      name: user.name,
      description: user.description,
      email: user.email,
      password: user.password
    }, ['id']);
    return addedUser[0].id;
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
      return token
    } else {
      return BadUserInput(['username', 'password'])
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
      return updatedUser[0]
    } else {
      throw new GraphQLError('Unspecified error occured', {
        extensions: {
          code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR
        }
      })
    }
  }
}