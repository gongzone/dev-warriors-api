import { Type } from '@sinclair/typebox';

const errors = {
  UserExists: {
    statusCode: 409,
    message: 'user already exists'
  },
  PasswordNotMatched: {
    statusCode: 409,
    message: 'password is not matched'
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

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}
