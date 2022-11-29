import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { getmeSchema } from './user.schema';

import UserService from './user.service';

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const userService = UserService.getInstance();

  fastify.get(
    '/me',
    {
      schema: getmeSchema
    },
    async (request, reply) => {
      const user = await userService.getme(request);
      reply.code(200).send(user);
    }
  );
};

export default userRoutes;
