import db from '../../../libs/db';

export const findUserByUsername = async (username: string) => {
  return db.user.findUnique({
    where: {
      username
    }
  });
};

export const findUserByEmail = async (email: string) => {
  return db.user.findUnique({
    where: {
      email
    }
  });
};
