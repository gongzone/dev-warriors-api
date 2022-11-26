import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProductDto } from './product.schema';
import { createProduct, getProducts } from './product.repository';

export const createProductHandler = async (
  request: FastifyRequest<{
    Body: CreateProductDto;
  }>,
  reply: FastifyReply
) => {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.userId
  });

  return product;
};

export const getProductsHandler = async () => {
  const products = await getProducts();
  return products;
};
