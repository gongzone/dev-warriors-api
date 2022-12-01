import { resetDB, disconnectDB } from '../../../libs/db';
import buildServer from '../../../libs/sever';

const server = buildServer();

beforeEach(async () => {
  await resetDB();
});

afterEach(async () => {
  await disconnectDB();
  await server.close();
});

test('POST `/api/auth/signup` create user successfully', async () => {
  const requestBody = {
    username: 'testss1234',
    password: 'w12345678*',
    confirmPassword: 'w12345678*',
    email: 'testss@gmail.com'
  };

  const response = await server.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: requestBody
  });

  expect(response.statusCode).toBe(201);
  expect(response.json()).toMatchObject({
    user: {
      id: expect.anything(),
      username: requestBody.username,
      email: requestBody.email
    },
    tokens: {
      accessToken: expect.anything(),
      refreshToken: expect.anything()
    }
  });
});
