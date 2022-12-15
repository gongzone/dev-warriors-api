import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import AppError from '../../libs/app-error';
import { setTokenCookie } from '../../libs/token';

import { signupSchema, loginSchema, refreshSchema } from './auth.schema';

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
      setTokenCookie(reply, result.tokens);
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
      setTokenCookie(reply, result.tokens);
      return reply.code(200).send(result);
    }
  );

  fastify.post(
    '/refresh',
    {
      schema: refreshSchema
    },
    async (request, reply) => {
      const refreshToken =
        request.body.refreshToken ?? request.cookies.refresh_token;

      console.log(refreshToken);

      if (!refreshToken) {
        throw new AppError('BadRequest');
      }

      const result = await authService.refreshToken(refreshToken);
      setTokenCookie(reply, result);
      return reply.code(200).send(result);
    }
  );
};

export default authRoutes;
