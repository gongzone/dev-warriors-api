import { FastifyReply, FastifyRequest } from 'fastify';
import * as argon2 from 'argon2';
import { CreateUserDto, LoginUserDto } from './user.schema';
import { createUser, findUserByEmail, findUsers } from './user.repository';
import server from '../../libs/sever';

// class UserService {
//   private static instance: UserService;
//   public static getInstance() {
//     if(!UserService.instance) {
//       UserService.instance = new UserService();
//     }

//     return UserService.instance;
//   }

//   async singup() {

//   }
// }

export const signupUserHandler = async (
  request: FastifyRequest<{
    Body: CreateUserDto;
  }>,
  reply: FastifyReply
) => {
  const dto = request.body;

  try {
    const user = await createUser(dto);
    return reply.code(201).send(user);
  } catch (err) {
    console.log(err);
    return reply.code(500).send(err);
  }
};

export const loginHandler = async (
  request: FastifyRequest<{
    Body: LoginUserDto;
  }>,
  reply: FastifyReply
) => {
  const dto = request.body;

  const user = await findUserByEmail(dto.email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password'
    });
  }

  const isPasswordMatched = await argon2.verify(user.password, dto.password);

  if (!isPasswordMatched) {
    return reply.code(401).send({
      message: 'Invalid email or password'
    });
  }

  return {
    accessToken: server.jwt.sign({
      userId: user.id,
      email: user.email,
      name: user.name
    })
  };
};

export const getUsersHandler = async () => {
  const users = await findUsers();
  return users;
};
