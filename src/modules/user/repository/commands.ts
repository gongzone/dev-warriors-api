import db from '../../../libs/db';
import { SignupDTO } from '../user.schema';
import * as argon2 from 'argon2';

export const createUser = async ({ username, password, email }: SignupDTO) => {
  const hashedPassword = await argon2.hash(password);

  const user = await db.user.create({
    data: {
      username,
      password: hashedPassword,
      email
    }
  });

  return user;
};
