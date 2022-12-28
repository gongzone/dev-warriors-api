import { Type } from '@sinclair/typebox';
import { appErrorSchema } from '../../libs/app-error';

const userResponse = Type.Object({
  id: Type.Number(),
  username: Type.String(),
  email: Type.String(),
  character: Type.Object({
    image: Type.String()
  })
});

export const getmeSchema = {
  tags: ['user'],
  response: {
    200: userResponse,
    401: appErrorSchema
  }
};
