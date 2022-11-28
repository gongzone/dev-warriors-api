import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { signupSchema, loginSchema } from './auth.schema';

import AuthService from './auth.service';

const authRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const authService = AuthService.getInstance();

  fastify.post(
    '/signup',
    {
      schema: signupSchema
    },
    async (request, reply) => {
      const result = await authService.singup(request.body);
      return reply.code(201).send(result);
    }
  );

  fastify.post(
    '/login',
    {
      schema: loginSchema
    },
    async (request, reply) => {
      const result = await authService.login(request.body);
      return reply.code(200).send(result);
    }
  );
};

export default authRoutes;
