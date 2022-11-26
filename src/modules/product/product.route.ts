import { FastifyInstance } from 'fastify';
import { createProductHandler, getProductsHandler } from './product.service';
import { $ref } from './product.schema';

const productRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema')
        }
      }
    },
    createProductHandler
  );

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: $ref('productsResponseSchema')
        }
      }
    },
    getProductsHandler
  );
};

export default productRoutes;
