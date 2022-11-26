import prisma from '../../../libs/prisma';

export const findUserByUserId = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      userId
    }
  });
};
