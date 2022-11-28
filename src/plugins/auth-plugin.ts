import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

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
    request.user = {
      id: 1,
      username: 'sdsdsds',
      email: 'dsdnsjndsj@gmail.com'
    };
  });
};

export default fp(authPlugin, {
  name: 'auth'
});
