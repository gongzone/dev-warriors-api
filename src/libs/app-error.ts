import { z } from 'zod';

type ErrorName = 'UserExistsError' | 'AuthenticationError' | 'UnknownError';
type ErrorInfo = {
  message: string;
  statusCode: number;
};

const statusCodeMap: Record<ErrorName, ErrorInfo> = {
  UserExistsError: {
    message: '아이디 또는 이메일이 이미 존재합니다.',
    statusCode: 409
  },
  AuthenticationError: {
    message: '유효하지 않은 아이디 또는 비밀번호입니다.',
    statusCode: 401
  },
  UnknownError: {
    message: '알 수 없는 에러가 발생하였습니다.',
    statusCode: 500
  }
};

class AppError extends Error {
  public statusCode: number;

  constructor(public name: ErrorName) {
    const info = statusCodeMap[name];

    super(info.message);
    this.statusCode = info.statusCode;
  }
}

export const appErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  statusCode: z.number()
});

export default AppError;
