import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

import { appErrorSchema } from '../../libs/app-error';
import { signupSchema, signupResponseSchema } from './schema/singup';
import { loginSchema, loginResponseSchema } from './schema/login';

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    appErrorSchema, // 밖으로 빼낼지 고민..
    signupSchema,
    signupResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  { $id: 'userSchemas' }
);
