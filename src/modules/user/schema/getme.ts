import { z } from 'zod';
import {
  id,
  username,
  password,
  email,
  accessToken,
  refreshToken
} from './fields';

export const getmeResponseSchema = z.object({
  id,
  username,
  email
});
