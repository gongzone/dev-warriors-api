import fp from 'fastify-plugin';
import { userSchemas } from '../modules/user/user.schema';
import { productSchemas } from '../modules/product/product.schema';
import { FastifyPluginCallback } from 'fastify';

const schemas = [...userSchemas, ...productSchemas];

const schemaPlugin: FastifyPluginCallback = (fastify, options, done) => {
  for (const schema of schemas) {
    fastify.addSchema(schema);
  }

  done();
};

export default fp(schemaPlugin);
