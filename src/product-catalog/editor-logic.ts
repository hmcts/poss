import type { Product } from './schema.ts';

export function generateProductId(): string {
  return `product-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 8)}`;
}

export function addNewProduct(products: Product[]): Product[] {
  const newProduct: Product = {
    id: generateProductId(),
    name: '',
    description: '',
    category: '',
    sku: '',
    status: 'active',
    eventTrigger: '',
    releaseScope: '',
    moscow: '',
    personas: [],
    hlFunction: '',
    userStory: '',
    expectedOutcomes: '',
    notes: '',
  };
  return [...products, newProduct];
}

export function applyProductEdit(
  products: Product[],
  id: string,
  patch: Partial<Omit<Product, 'id'>>,
): Product[] {
  return products.map((p) => (p.id === id ? { ...p, ...patch } : p));
}

export function deleteProduct(products: Product[], id: string): Product[] {
  return products.filter((p) => p.id !== id);
}
