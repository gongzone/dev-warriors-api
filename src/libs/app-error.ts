import { Type } from '@sinclair/typebox';
import { TokenError } from 'fast-jwt';

// 에러처리 공부 필요..

const errors = {
  UserExists: {
    statusCode: 409,
    message: 'user already exists'
  },
  PasswordNotMatched: {
    statusCode: 422,
    message: 'password does not match'
  },
  WrongCredentials: {
    statusCode: 401,
    message: 'Invalid username or password'
  },
  Unknown: {
    statusCode: 500,
    message: 'Unknown error'
  },
  Unauthorized: {
    statusCode: 401,
    message: 'Unauthorized'
  },
  BadRequest: {
    statusCode: 400,
    message: 'Bad Request'
  },
  RefreshFailure: {
    statusCode: 401,
    message: 'Failed to refresh token'
  },
  NotFound: {
    statusCode: 404,
    message: 'Not Found'
  },
  Forbidden: {
    statusCode: 403,
    message: 'Forbidden'
  },
  InvalidURL: {
    statusCode: 422,
    message: 'Invalid URL'
  },
  AlreadyExists: {
    statusCode: 409,
    message: 'The data already exists'
  }
} as const;

type ErrorName = keyof typeof errors;

export default class AppError extends Error {
  public statusCode: number;

  constructor(public name: ErrorName) {
    super(errors[name].message);

    this.statusCode = errors[name].statusCode;
  }
}

export const appErrorSchema = Type.Object({
  name: Type.String(),
  message: Type.String(),
  statusCode: Type.Number()
});

// appErrorSchema.example = {
//   name: 'hi',
//   message: ''
// };

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function isTokenError(error: any) {
  return error instanceof TokenError;
}
