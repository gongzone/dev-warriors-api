import * as argon2 from 'argon2';

import { LoginDto, SignupDTO } from './user.schema';

import { createUser } from './repository/commands';
import { findUserByEmail, findUserByUsername } from './repository/queries';
import AppError from '../../libs/app-error';
import { generateToken } from '../../libs/token';
import { User } from '@prisma/client';

export default class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  private async generateTokens(user: User) {
    const { id: userId, username } = user;

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

  async singup({ username, password, confirmPassword, email }: SignupDTO) {
    const foundUserByUsername = await findUserByUsername(username);
    const foundUserByEmail = await findUserByEmail(email);

    if (foundUserByUsername || foundUserByEmail) {
      throw new AppError('UserExistsError');
    }

    if (password !== confirmPassword) {
      throw new AppError('PasswordsNotMatched');
    }

    const user = await createUser({ username, password, email });

    const tokens = await this.generateTokens(user);

    return {
      tokens,
      user
    };
  }

  async login({ username, password }: LoginDto) {
    const foundUserByUsername = await findUserByUsername(username);

    if (!foundUserByUsername) {
      throw new AppError('AuthenticationError');
    }

    const matched = await argon2.verify(foundUserByUsername.password, password);

    if (!matched) {
      throw new AppError('AuthenticationError');
    }

    const tokens = await this.generateTokens(foundUserByUsername);

    return { tokens, user: foundUserByUsername };
  }
}
