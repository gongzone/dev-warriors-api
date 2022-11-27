import { z } from 'zod';
import {
  id,
  username,
  password,
  confirmPassword,
  email,
  accessToken,
  refreshToken
} from './fields';

export const signupSchema = z
  .object({
    username,
    password,
    confirmPassword,
    email
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

export const signupResponseSchema = z.object({
  tokens: z.object({
    accessToken,
    refreshToken
  }),
  user: z.object({
    id,
    username,
    email
  })
});
