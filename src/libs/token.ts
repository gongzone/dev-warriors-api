import { createSigner, createVerifier, TokenError } from 'fast-jwt';
import { FastifyReply } from 'fastify';
import AppError from './app-error';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  console.warn('JWT_SECRET_KEY is not defined in .env file');
}

export interface AccessTokenPayload {
  type: 'access_token';
  userId: number;
  tokenId: number;
  username: string;
  email: string;
}

export interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  rotationCounter: number;
}

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

export const tokensDuration = {
  access_token: 1000 * 5,
  refresh_token: 1000 * 60 * 60 * 24 * 7
} as const;

export async function generateToken(payload: TokenPayload) {
  const signWithPromise = createSigner({
    key: async () => JWT_SECRET_KEY,
    expiresIn: tokensDuration[payload.type]
  });

  // 토큰 생성 실패 시 에러 코드 보낼 것.
  const token = await signWithPromise(payload);
  return token;
}

export async function validateToken<T>(token: string) {
  const verifyWithPromise = createVerifier({
    key: async () => JWT_SECRET_KEY,
    cache: 1000
  });

  try {
    const payload: T = await verifyWithPromise(token);
    return payload;
  } catch (err) {
    if (err instanceof TokenError) {
      if (err.code === 'FAST_JWT_EXPIRED')
        throw new AppError('Unauthorized'); // expired 에러 보낼 것.
      else throw new AppError('Unauthorized');
    }
  }
}

export function setTokenCookie(
  reply: FastifyReply,
  tokens: { accessToken: string; refreshToken: string }
) {
  reply.setCookie('access_token', tokens.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + tokensDuration.access_token),
    path: '/'
  });
  reply.setCookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + tokensDuration.refresh_token),
    path: '/'
  });
}
