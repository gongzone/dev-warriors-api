import prisma from '../../libs/prisma';
import { CreateUserDto } from './user.schema';
import * as argon2 from 'argon2';

export const createUser = async (dto: CreateUserDto) => {
  const hashedPassword = await argon2.hash(dto.password);

  const user = await prisma.user.create({
    data: {
      email: dto.email,
      name: dto.name,
      password: hashedPassword
    }
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const findUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true
    }
  });
};
