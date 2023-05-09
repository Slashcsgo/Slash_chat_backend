import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from "graphql"

enum ErrorCodes {
  unauthorized = "UNAUTHORIZED",
}

export const Unauthorized = () => {
  throw new GraphQLError('Unauthorized. You have to login', {
    extensions: {
      code: ErrorCodes.unauthorized
    }
  })
}

export const BadUserInput = (badField?: string | string[]) => {
  throw new GraphQLError('Invalid argument value', {
    extensions: {
      code: ApolloServerErrorCode.BAD_USER_INPUT,
      argumentName: badField
    }
  })
}