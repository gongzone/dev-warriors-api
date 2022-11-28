import fp from 'fastify-plugin';
import { userSchemas } from '../modules/user/user.schema';
import { FastifyPluginAsync } from 'fastify';

const schemas = [...userSchemas];

const schemaPlugin: FastifyPluginAsync = async (fastify) => {
  for (const schema of schemas) {
    fastify.addSchema(schema);
  }
};

export default fp(schemaPlugin, {
  name: 'schema'
});
