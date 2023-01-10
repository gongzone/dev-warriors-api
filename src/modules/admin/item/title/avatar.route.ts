import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { getmeSchema } from './avatar.schema';

// import UserService from './user.service';

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/me',
    {
      schema: getmeSchema,
      preHandler: [fastify.requireAuth]
    },
    async (request, reply) => {
      return reply.code(200).send(request.user);
    }
  );
};

export default userRoutes;
