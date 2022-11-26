import { z } from 'zod';
import { userId, password, accessToken, refreshToken } from './fields';

export const loginSchema = z.object({
  userId,
  password
});

export const loginResponseSchema = z.object({
  accessToken,
  refreshToken
});
