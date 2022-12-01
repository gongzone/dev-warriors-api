import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../libs/app-error';
import { AccessTokenPayload, validateToken } from '../libs/token';

declare module 'fastify' {
  interface FastifyInstance {
    requireAuth: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      username: string;
      email: string;
    } | null;
    isExpiredToken: boolean;
  }
}

const requireAuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('isExpiredToken', false);

  fastify.decorate(
    'requireAuth',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token =
        request.headers.authorization?.split('Bearer ')[1] ??
        request.cookies.access_token;

      if (!token) throw new AppError('Unauthorized');

      const decoded = await validateToken<AccessTokenPayload>(token);

      if (!decoded) throw new AppError('Unauthorized');

      request.user = {
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };
    }
  );
};

export default fp(requireAuthPlugin, {
  name: 'requireAuth'
});
