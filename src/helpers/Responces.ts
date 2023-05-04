import { Chat } from "../types/Chat"
import { Message } from "../types/Message"
import { User } from "../types/User"

export const UnauthorizedResponce = {
  success: false,
  error: {
    message: 'Unauthorized. You have to login',
    code: 401
  }
}

export const NoAccessResponce = {
  success: false,
  error: {
    message: 'NoAccess. You have no rights to do this',
    code: 403
  }
}

export const WrongUsernameOrPassword = {
  success: false,
  error: {
    message: 'Wrong username or password',
    code: 403
  }
}

export const BadRequest = {
  success: false,
  error: {
    message: 'Bad Request. Please provide valid data',
    code: 400
  }
}

export const Success = {
  success: true,
  error: null
}

export const DataNotChanged = {
  success: true,
  error: null
}

export const SuccessWithToken = (token: String) => {
  return {
    success: true,
    error: null,
    token
  }
}

export const MessageSuccess 
  = (message: Message) => {
    return {
      success: true,
      error: null,
      message
    }
  }

export const UserSuccess
  = (user: User) => {
    return {
      success: true,
      error: null,
      user
    }
  }

export const ChatSuccess
  = (chat: Chat) => {
    return {
      success: true,
      error: null,
      chat
    }
  }