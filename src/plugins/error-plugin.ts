import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../libs/app-error';

const errorPlugin: FastifyPluginCallback = (fastify, options, done) => {
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

  done();
};

export default fp(errorPlugin);
