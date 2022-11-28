import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import userRoutes from '../modules/user/user.route';

const routePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(userRoutes, { prefix: 'api/users' });
};

export default fp(routePlugin, {
  name: 'route',
  dependencies: ['swagger']
});
