import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../libs/app-error';
import db from '../libs/db';
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
      console.log(request.headers);
      console.log(request.headers.authorization);

      const token =
        request.headers.authorization?.split('Bearer ')[1] ??
        request.cookies.access_token;

      if (request.cookies.refresh_token && !token) {
        request.isExpiredToken = true;
        return;
      }

      if (!token) throw new AppError('Unauthorized');

      const decoded = await validateToken<AccessTokenPayload>(token);

      if (!decoded) throw new AppError('Unauthorized');

      const currentUser = await db.user.findUnique({
        where: {
          id: decoded.userId
        },
        include: {
          character: true
        }
      });

      if (!currentUser) throw new AppError('Unauthorized');

      request.user = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        character: {
          image: currentUser.character.image
        }
      };
    }
  );
};

export default fp(requireAuthPlugin, {
  name: 'requireAuth'
});
