import { z } from 'zod';
import {
  id,
  username,
  password,
  email,
  accessToken,
  refreshToken
} from './fields';

export const loginSchema = z.object({
  username,
  password
});

export const loginResponseSchema = z.object({
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
