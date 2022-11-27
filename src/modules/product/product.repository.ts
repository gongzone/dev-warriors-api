import prisma from '../../libs/db';
import { CreateProductDto } from './product.schema';

export const createProduct = async (
  dto: CreateProductDto & { ownerId: number }
) => {
  const product = await prisma.product.create({
    data: {
      title: dto.title,
      price: dto.price,
      content: dto.content,
      ownerId: dto.ownerId
    }
  });

  return product;
};

export const getProducts = async () => {
  return await prisma.product.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      price: true,
      content: true,
      owner: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
