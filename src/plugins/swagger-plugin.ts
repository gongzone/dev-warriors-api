import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { withRefResolver } from 'fastify-zod';

const swaggerPlugin: FastifyPluginCallback = (fastify, options, done) => {
  fastify
    .register(
      swagger,
      withRefResolver({
        exposeRoute: true,
        openapi: {
          info: {
            title: 'Fastify API',
            description: 'API for some products',
            version: '1.0.0'
          }
        }
      })
    )
    .register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        deepLinking: false
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        }
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true
    });

  done();
};

export default fp(swaggerPlugin);
