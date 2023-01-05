import { Type, Static } from '@sinclair/typebox';
import { appErrorSchema } from '../../libs/app-error';

const signupBody = Type.Object({
  username: Type.RegEx(/^[A-Za-z]{1}[A-Za-z0-9]{4,19}$/, {
    errorMessage: '아이디 생성 규칙에 따라 작성하여 주십시오.',
    examples: ['user123']
  }),
  password: Type.RegEx(
    /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/,
    {
      errorMessage: '비밀번호 생성 규칙에 따라 작성하여 주십시오.',
      examples: ['password123*']
    }
  ),
  confirmPassword: Type.String({
    examples: ['password123*']
  }),
  email: Type.String({
    format: 'email',
    errorMessage: '이메일 형식에 맞게 작성하여 주십시오.',
    examples: ['user123@gmail.com']
  })
});

const loginBody = Type.Object({
  username: Type.String({ examples: ['user123'] }),
  password: Type.String({ examples: ['password123*'] })
});

const refreshBody = Type.Object({
  refreshToken: Type.Optional(Type.String())
});

const tokenConfig = Type.Object({
  httpOnly: Type.Boolean(),
  expires: Type.String(),
  path: Type.String()
});

const authResponse = Type.Object({
  tokens: Type.Object({
    accessToken: Type.Object({
      value: Type.String(),
      config: tokenConfig
    }),
    refreshToken: Type.Object({
      value: Type.String(),
      config: tokenConfig
    })
  }),
  user: Type.Object({
    id: Type.Number(),
    username: Type.String(),
    email: Type.String()
  })
});

const refreshResponse = Type.Object({
  accessToken: Type.Object({
    value: Type.String(),
    config: tokenConfig
  }),
  refreshToken: Type.Object({
    value: Type.String(),
    config: tokenConfig
  })
});

export type SignupBodyType = Static<typeof signupBody>;
export type LoginBodyType = Static<typeof loginBody>;

export const signupSchema = {
  tags: ['auth'],
  body: signupBody,
  response: {
    201: authResponse,
    400: appErrorSchema,
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
