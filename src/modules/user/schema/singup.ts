import { z } from 'zod';
import { id, userId, password, confirmPassword, email } from './fields';

export const signupSchema = z
  .object({
    userId,
    password,
    confirmPassword,
    email
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

export const signupResponseSchema = z.object({
  id,
  userId,
  email
});
