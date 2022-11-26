import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const product = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGenerated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...product,
});

const productResponseSchema = z.object({
  ...product,
  ...productGenerated,
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  { $id: 'productSchemas' }
);
