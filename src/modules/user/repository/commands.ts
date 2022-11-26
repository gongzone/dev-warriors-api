import prisma from '../../../libs/prisma';
import { SignupDTO } from '../user.schema';
import * as argon2 from 'argon2';

export const createUser = async (userData: SignupDTO) => {
  const hashedPassword = await argon2.hash(userData.password);

  const user = await prisma.user.create({
    data: {
      userId: userData.userId,
      password: hashedPassword,
      email: userData.email
    }
  });

  return user;
};
