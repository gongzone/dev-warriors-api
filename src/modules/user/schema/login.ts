import { z } from 'zod';
import { username, password, accessToken, refreshToken } from './fields';

export const loginSchema = z.object({
  username,
  password
});

export const loginResponseSchema = z.object({
  accessToken,
  refreshToken
});
