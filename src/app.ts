import * as path from 'path';
import server from './libs/sever';
import autoload from '@fastify/autoload';
import 'dotenv/config';
import authRoutes from './modules/auth/auth.route';

server.register(autoload, {
  dir: path.join(__dirname, 'plugins')
});

server.register(authRoutes, { prefix: 'api/auth' });

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
