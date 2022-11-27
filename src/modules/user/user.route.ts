import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { $ref, SignupDTO } from './user.schema';

import UserService from './user.service';

const userRoutes = async (fastify: FastifyInstance) => {
  const userService = UserService.getInstance();

  fastify.post(
    '/signup',
    {
      schema: {
        body: $ref('signupSchema'),
        response: {
          201: $ref('signupResponseSchema'),
          409: $ref('appErrorSchema')
        }
      }
    },
    async (
      request: FastifyRequest<{
        Body: SignupDTO;
      }>,
      reply: FastifyReply
    ) => {
      const user = await userService.singup(request.body);
      return reply.code(201).send(user);
    }
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
