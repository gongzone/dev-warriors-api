import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../libs/app-error';

const errorPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        name: error.name,
        message: error.message,
        statusCode: error.statusCode
      });
    }

    if (error.statusCode === 400) {
      return reply.code(400).send({
        name: 'BadRequest',
        message: error.message,
        statusCode: 400
      });
    }

    return reply.code(500).send({
      name: error.name,
      message: error.message,
      statusCode: 500
    });
  });
};

export default fp(errorPlugin, {
  name: 'error'
});
