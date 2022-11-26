import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJWT from '@fastify/jwt';

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  if (!process.env.JWT_SECRET_KEY) return;

  fastify
    .register(fastifyJWT, {
      secret: process.env.JWT_SECRET_KEY
    })
    .decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.send(err);
        }
      }
    );
};

export default fp(jwtPlugin);
