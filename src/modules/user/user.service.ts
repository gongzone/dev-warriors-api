import * as argon2 from 'argon2';
import { FastifyReply, FastifyRequest } from 'fastify';

import server from '../../libs/sever';

import { SignupDTO, LoginUserDto } from './user.schema';

import { createUser } from './repository/commands';
import { findUserByUserId } from './repository/queries';

export default class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  async singup(
    request: FastifyRequest<{
      Body: SignupDTO;
    }>,
    reply: FastifyReply
  ) {
    const userData = request.body;

    try {
      const user = await createUser(userData);
      return reply.code(201).send(user);
    } catch (err) {
      console.log(err);
      return reply.code(500).send(err);
    }
  }

  async login(
    request: FastifyRequest<{
      Body: LoginUserDto;
    }>,
    reply: FastifyReply
  ) {
    const userData = request.body;

    const targetUser = await findUserByUserId(userData.userId);

    if (!targetUser) {
      return reply.code(401).send({
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatched = await argon2.verify(
      targetUser.password,
      userData.password
    );

    if (!isPasswordMatched) {
      return reply.code(401).send({
        message: 'Invalid email or password'
      });
    }

    return {
      accessToken: server.jwt.sign({
        id: targetUser.id,
        userId: targetUser.userId,
        email: targetUser.email
      })
      // refreshToken 추가 필요 & jwt 인증 상세히 다루기 & postman token 인증 설정
    };
  }
}
