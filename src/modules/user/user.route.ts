import { FastifyInstance } from 'fastify';

import { $ref } from './user.schema';

import UserService from './user.service';

const userRoutes = async (fastify: FastifyInstance) => {
  const userService = UserService.getInstance();

  fastify.post(
    '/signup',
    {
      schema: {
        body: $ref('signupSchema'),
        response: {
          201: $ref('signupResponseSchema')
        }
      }
    },
    userService.singup
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
    userService.login
  );
};

export default userRoutes;
