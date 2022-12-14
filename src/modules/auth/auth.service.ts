import * as argon2 from 'argon2';

import AppError from '../../libs/app-error';
import {
  generateToken,
  RefreshTokenPayload,
  tokensDuration,
  validateToken
} from '../../libs/token';
import { Token, User } from '@prisma/client';
import db from '../../libs/db';
import { LoginBodyType, SignupBodyType } from './auth.schema';
import { v2 as cloudinary } from 'cloudinary';

export default class UserService {
  private static instance: UserService;
  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  private async createToken(userId: number) {
    const token = await db.token.create({
      data: {
        userId
      }
    });

    return token;
  }

  private async generateTokens(user: User, tokenItem?: Token) {
    const { id: userId, username, email } = user;
    const token = tokenItem ?? (await this.createToken(userId));

    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        userId,
        tokenId: token.id,
        username: username,
        email: email
      }),
      generateToken({
        type: 'refresh_token',
        tokenId: token.id,
        rotationCounter: token.rotationCounter
      })
    ]);

    return {
      accessToken: {
        value: accessToken,
        config: {
          httpOnly: true,
          expires: new Date(
            Date.now() + tokensDuration.access_token
          ).toString(),
          path: '/'
        }
      },
      refreshToken: {
        value: refreshToken,
        config: {
          httpOnly: true,
          expires: new Date(
            Date.now() + tokensDuration.refresh_token
          ).toString(),
          path: '/'
        }
      }
    };
  }

  async login({ username, password }: LoginBodyType) {
    const foundUserByUsername = await db.user.findUnique({
      where: {
        username
      }
    });

    if (!foundUserByUsername) {
      throw new AppError('WrongCredentials');
    }

    const matched = await argon2.verify(foundUserByUsername.password, password);

    if (!matched) {
      throw new AppError('WrongCredentials');
    }

    const tokens = await this.generateTokens(foundUserByUsername);

    return {
      tokens,
      user: foundUserByUsername
    };
  }

  async singup({ username, password, confirmPassword, email }: SignupBodyType) {
    const foundUser = await db.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (foundUser) {
      throw new AppError('UserExists');
    }

    if (password !== confirmPassword) {
      throw new AppError('PasswordsNotMatched');
    }

    const hashedPassword = await argon2.hash(password);
    const characterImage = cloudinary.url('character-image/labrador-head.svg', {
      width: 128,
      height: 128,
      color: 'white'
    });

    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        character: {
          create: {
            name: username
          }
        }
      }
    });

    const tokens = await this.generateTokens(user);

    return {
      tokens,
      user
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = await validateToken<RefreshTokenPayload>(token);

      if (!decoded) throw new Error('Token validation failed');

      const tokenItem = await db.token.findUnique({
        where: {
          id: decoded.tokenId
        },
        include: {
          user: true
        }
      });

      console.log(
        tokenItem?.rotationCounter,
        decoded.rotationCounter,
        tokenItem?.blocked
      );

      if (!tokenItem) throw new Error('Token not found');
      // if (tokenItem.blocked) throw new Error('Token is blocked');

      if (tokenItem.rotationCounter !== decoded.rotationCounter) {
        await db.token.update({
          where: {
            id: tokenItem.id
          },
          data: {
            blocked: true
          }
        });
        // throw new Error('Rotation counter does not match');
      }

      tokenItem.rotationCounter += 1;
      await db.token.update({
        where: {
          id: tokenItem.id
        },
        data: {
          rotationCounter: tokenItem.rotationCounter
        }
      });
      const tokens = await this.generateTokens(tokenItem.user, tokenItem);
      return {
        ...tokens
      };
    } catch (err) {
      throw new AppError('RefreshFailure');
    }
  }
}
