import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

import { signupSchema, signupResponseSchema } from './schema/singup';
import { loginSchema, loginResponseSchema } from './schema/login';

export type SignupDTO = z.infer<typeof signupSchema>;
export type LoginUserDto = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    signupSchema,
    signupResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  { $id: 'userSchemas' }
);
