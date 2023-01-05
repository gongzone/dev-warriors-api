import { Type } from '@sinclair/typebox';

const errors = {
  ValidationError: {
    statusCode: 400,
    message: '검증 처리에서 문제가 발생하였습니다.'
  },
  WrongCredentials: {
    statusCode: 401,
    message: '아이디 혹은 비밀번호가 틀렸습니다.'
  },
  UserExists: {
    statusCode: 409,
    message: '이미 가입된 아이디 또는 이메일입니다.'
  },
  PasswordsNotMatched: {
    statusCode: 422,
    message: '비밀번호가 일치하지 않습니다.'
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
