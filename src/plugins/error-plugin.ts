import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../libs/app-error';

const errorPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode ?? 500).send({
        name: error.name,
        message: error.message,
        statusCode: error.statusCode
      });
    }

    return error;
  });
};

export default fp(errorPlugin, {
  name: 'error'
});
