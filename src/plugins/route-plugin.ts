import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import userRoutes from '../modules/user/user.route';
import productRoutes from '../modules/product/product.route';

const routePlugin: FastifyPluginCallback = (fastify) => {
  fastify.register(userRoutes, { prefix: 'api/users' });
  fastify.register(productRoutes, { prefix: 'api/products' });
};

export default fp(routePlugin);
