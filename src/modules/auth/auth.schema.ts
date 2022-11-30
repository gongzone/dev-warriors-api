import { Type, Static } from '@sinclair/typebox';
import { appErrorSchema } from '../../libs/app-error';

// regex --> validation 필요
// username: /^[A-Za-z]{1}[A-Za-z0-9]{3,19}$/
// password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/
// 비밀번호와 비밀번호 확인 일치 validation? -> 이미 서비스단에서 체크하는데?

const signupBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
  confirmPassword: Type.String(),
  email: Type.String()
});

const loginBody = Type.Object({
  username: Type.String(),
  password: Type.String()
});

const refreshBody = Type.Object({
  refreshToken: Type.Optional(Type.String())
});

const authResponse = Type.Object({
  tokens: Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String()
  }),
  user: Type.Object({
    id: Type.Number(),
    username: Type.String(),
    email: Type.String()
  })
});

const refreshResponse = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String()
});

export type SignupBodyType = Static<typeof signupBody>;
export type LoginBodyType = Static<typeof loginBody>;

export const signupSchema = {
  tags: ['auth'],
  body: signupBody,
  response: {
    201: authResponse,
    409: appErrorSchema,
    422: appErrorSchema
  }
};

export const loginSchema = {
  tags: ['auth'],
  body: loginBody,
  response: {
    200: authResponse,
    401: appErrorSchema
  }
};

export const refreshSchema = {
  tags: ['auth'],
  body: refreshBody,
  response: {
    200: refreshResponse,
    401: appErrorSchema
  }
};
