import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { tokensDuration } from '../../libs/token';

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
      reply.setCookie('access_token', result.tokens.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + tokensDuration.access_token),
        path: '/'
      });
      reply.setCookie('refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + tokensDuration.refresh_token),
        path: '/'
      });
      return reply.code(200).send(result);
    }
  );
};

export default authRoutes;
