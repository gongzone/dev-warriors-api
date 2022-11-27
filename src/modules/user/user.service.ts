import * as argon2 from 'argon2';
import { FastifyReply, FastifyRequest } from 'fastify';

import { SignupDTO, LoginUserDto } from './user.schema';

import { createUser } from './repository/commands';
import { findUserByEmail, findUserByUsername } from './repository/queries';
import AppError from '../../libs/app-error';
import { generateToken } from '../../libs/token';

export default class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  private async generateTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        userId,
        tokenId: 1,
        username: username
      }),
      await generateToken({
        type: 'refresh_token',
        tokenId: 1,
        rotationCounter: 1
      })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async singup(userData: SignupDTO) {
    const foundUserByUsername = await findUserByUsername(userData.username);
    const foundUserByEmail = await findUserByEmail(userData.email);

    if (foundUserByUsername || foundUserByEmail) {
      throw new AppError('UserExistsError');
    }

    const user = await createUser(userData);

    const tokens = await this.generateTokens(user.id, user.username);

    return {
      tokens,
      user
    };
  }

  async login(
    request: FastifyRequest<{
      Body: LoginUserDto;
    }>,
    reply: FastifyReply
  ) {
    //   const userData = request.body;
    //   const targetUser = await findUserByUsername(userData.username);
    //   if (!targetUser) {
    //     return reply.code(401).send({
    //       message: 'Invalid email or password'
    //     });
    //   }
    //   const isPasswordMatched = await argon2.verify(
    //     targetUser.password,
    //     userData.password
    //   );
    //   if (!isPasswordMatched) {
    //     return reply.code(401).send({
    //       message: 'Invalid email or password'
    //     });
    //   }
    //   const accessToken = await reply.jwtSign({
    //     id: targetUser.id,
    //     username: targetUser.username,
    //     email: targetUser.email
    //   });
    //   return {
    //     accessToken
    //     // refreshToken 추가 필요 & jwt 인증 상세히 다루기 & postman token 인증 설정
    //   };
  }
}
