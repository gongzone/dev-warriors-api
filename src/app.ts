import * as path from 'path';
import server from './libs/sever';
import autoload from '@fastify/autoload';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    config: {
      JWT_SECRET_KEY: string;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      username: string;
      email: string;
    };
  }
}

server.register(autoload, {
  dir: path.join(__dirname, 'plugins')
});

const startServer = async () => {
  try {
    await server.listen({ port: 4000, host: '0.0.0.0' });
    console.log(`Server ready at http://localhost:4000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
