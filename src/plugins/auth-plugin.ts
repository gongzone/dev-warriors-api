import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import { isTokenError } from '../libs/app-error';
import { validateToken } from '../libs/token';
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

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCookie);
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('isExpiredToken', false);

  fastify.addHook('preHandler', async (request, reply) => {
    const token = request.headers.authorization?.split('Bearer ')[1] ?? request.cookies.access_token
    
    if(!token) return;

    try {
      const decoded = await validateToken(token);
      request.user = {
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };
    } catch (err: any) {
      if (isTokenError(err)) {
        if (err.name === 'TokenExpiredError') {
          request.isExpiredToken = true;
        }
      }
    }
  });
};

export default fp(authPlugin, {
  name: 'auth',
  dependencies: 
});
