import Fastify from 'fastify';
import 'dotenv/config';
import authRoutes from '../modules/auth/auth.route';
import userRoutes from '../modules/user/user.route';
import fastifyCookie from '@fastify/cookie';
import requireAuthPlugin from '../plugins/require-auth-plugin';
import errorPlugin from '../plugins/error-plugin';
import swaggerPlugin from '../plugins/swagger-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    start: () => Promise<void>;
  }
}

export default function buildServer() {
  const server = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  server.decorate('start', async () => {
    try {
      await server.listen({ port: 4000, host: '0.0.0.0' });
      console.log(`Server ready at http://localhost:4000`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  });

  server.register(fastifyCookie);
  server.register(swaggerPlugin);

  server.register(errorPlugin);
  server.register(requireAuthPlugin);

  server.register(authRoutes, { prefix: 'api/auth' });
  server.register(userRoutes, { prefix: 'api/users' });

  return server;
}
