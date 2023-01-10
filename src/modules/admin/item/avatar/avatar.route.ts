import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const avatarRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/new',
    {
      preHandler: [fastify.upload.single('avatar')]
    },
    async (request, reply) => {
      console.log(`아바타: ${request.file}`);

      return reply.code(200).send({});
    }
  );
};

export default avatarRoutes;
