import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  sku: z.string(),
  status: z.enum(['active', 'inactive']).default('active'),
  // Journey coverage fields
  eventTrigger: z.string().optional().default(''),
  releaseScope: z.string().optional().default(''),
  moscow: z.string().optional().default(''),
  personas: z.array(z.string()).optional().default([]),
  hlFunction: z.string().optional().default(''),
  userStory: z.string().optional().default(''),
  expectedOutcomes: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductCatalogBlobSchema = z.object({
  products: z.array(ProductSchema),
});

export type ProductCatalogBlob = z.infer<typeof ProductCatalogBlobSchema>;
