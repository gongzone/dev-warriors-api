import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { validateToken, isTokenError } from '../libs/token';
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      username: string;
      email: string;
    } | null;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null);

  fastify.addHook('preHandler', async (request, reply) => {
    const { authorization } = request.headers;

    if (!authorization || authorization.includes('Bearer')) {
      return;
    }

    const token = authorization.split('Bearer ')[1];

    try {
      const decoded = await validateToken(token);
    } catch (err: any) {
      if (isTokenError(err)) {
        if (err.name === 'TokenExpiredError') {
        }
      }
    }
  });
};

export default fp(authPlugin, {
  name: 'auth'
});
