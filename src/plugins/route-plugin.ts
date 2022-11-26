import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import userRoutes from '../modules/user/user.route';

const routePlugin: FastifyPluginCallback = (fastify, options, done) => {
  fastify.register(userRoutes, { prefix: 'api/users' });

  done();
};

export default fp(routePlugin);
