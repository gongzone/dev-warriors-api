import { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  loginHandler,
  signupUserHandler
} from './user.service';
import { $ref } from './user.schema';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema')
        }
      }
    },
    signupUserHandler
  );

  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        }
      }
    },
    loginHandler
  );

  fastify.get('/', { onRequest: [fastify.authenticate] }, getUsersHandler);
};

export default userRoutes;
