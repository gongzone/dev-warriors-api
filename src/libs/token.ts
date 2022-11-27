import { createSigner, createVerifier } from 'fast-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  console.warn('JWT_SECRET_KEY is not defined in .env file');
}

interface AccessTokenPayload {
  type: 'access_token';
  userId: number;
  tokenId: number;
  username: string;
}

interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  rotationCounter: number;
}

type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

const tokensDuration = {
  access_token: 1000 * 60 * 24,
  refresh_token: 1000 * 60 * 24 * 7
} as const;

export async function generateToken(payload: TokenPayload) {
  const signWithPromise = createSigner({
    key: async () => JWT_SECRET_KEY,
    expiresIn: tokensDuration[payload.type]
  });

  const token = await signWithPromise(payload);

  if (!token) {
    throw new Error('토큰이 존재하지 않습니다.');
  }

  return token;
}

export async function validateToken(token: string) {
  try {
    const verifyWithPromise = createVerifier({
      key: async () => JWT_SECRET_KEY,
      cache: 1000
    });

    const payload = await verifyWithPromise(token);
    return payload;
  } catch (err) {
    console.log(err);
  }
}
