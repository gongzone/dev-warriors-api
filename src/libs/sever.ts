import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multer from 'fastify-multer';
import ajvErrors from 'ajv-errors';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import authRoutes from '../modules/auth/auth.route';
import userRoutes from '../modules/user/user.route';
import fastifyCookie from '@fastify/cookie';
import requireAuthPlugin from '../plugins/require-auth-plugin';
import errorPlugin from '../plugins/error-plugin';
import swaggerPlugin from '../plugins/swagger-plugin';
import adminRoutes from '../modules/admin/admin.route';

declare module 'fastify' {
  interface FastifyInstance {
    start: () => Promise<void>;
    upload: ReturnType<typeof multer>;
  }
}

export default function buildServer() {
  const server = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    },
    ajv: {
      customOptions: { allErrors: true },
      plugins: [ajvErrors]
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

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'character-avatar',
        format: ['svg'],
        transformation: [{ width: 128, height: 128, color: 'white' }]
      };
    }
  });

  const upload = multer({ storage });

  server.decorate('upload', upload);

  if (process.env.NODE_ENV === 'development') {
    server.register(cors, {
      origin: /localhost/,
      allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
      credentials: true
    });
  } else {
    server.register(cors, {
      origin: /veltrends.com/,
      allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
      credentials: true
    });
  }

  server.register(fastifyCookie);
  server.register(swaggerPlugin);

  server.register(errorPlugin);
  server.register(requireAuthPlugin);

  server.register(authRoutes, { prefix: 'api/auth' });
  server.register(userRoutes, { prefix: 'api/users' });
  server.register(adminRoutes, { prefix: 'api/admin' });

  return server;
}
