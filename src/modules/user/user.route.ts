import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import UserService from './user.service';

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const userService = UserService.getInstance();

  fastify.get(
    '/me',
    {
      schema: {}
    },
    async (request, reply) => {
      const user = await userService.getme(request.user);
      reply.code(200).send(user);
    }
  );
};

export default userRoutes;
