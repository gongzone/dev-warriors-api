import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import swagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import swaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

const swaggerConfig: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: 'Dev Warriors API',
      description: 'API for Dev Warriors',
      version: '1.0.0'
    }
  }
};

const swaggerUiConfig: FastifySwaggerUiOptions = {
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
};

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify
    .register(swagger, swaggerConfig)
    .register(swaggerUi, swaggerUiConfig);
};

export default fp(swaggerPlugin, {
  name: 'swagger'
});
