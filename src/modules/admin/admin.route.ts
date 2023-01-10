import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import avatarRoutes from './item/avatar/avatar.route';

const adminRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.register(avatarRoutes, { prefix: 'items/avatars' });
};

export default adminRoutes;
