import { Injectable } from '@angular/core';

export type DummyProduct = Readonly<Record<string, unknown>> & {
  readonly id: number;
  readonly title: string;
  readonly category: string;
  readonly price: number;
  readonly stock: number;
  readonly rating: number;
};

export interface DummyProductPage {
  readonly products: readonly DummyProduct[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

const BASE_URL = 'https://dummyjson.com/products';
const SELECT_FIELDS = 'id,title,category,price,stock,rating';

@Injectable({ providedIn: 'root' })
export class DummyProductsApiService {
  async getProducts(signal: AbortSignal, limit?: number): Promise<DummyProductPage> {
    const url = new URL(BASE_URL);
    if (limit !== undefined) url.searchParams.set('limit', String(limit));
    url.searchParams.set('select', SELECT_FIELDS);

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error('El API de productos no está disponible. Inténtalo de nuevo.');
    }
    return parseProductPage(await response.json());
  }
}

function parseProductPage(payload: unknown): DummyProductPage {
  if (!isRecord(payload) || !Array.isArray(payload['products'])) {
    throw new Error('El API devolvió productos con un formato inesperado.');
  }

  const products = payload['products'].filter(isDummyProduct);
  const total = payload['total'];
  const skip = payload['skip'];
  const limit = payload['limit'];
  if (
    typeof total !== 'number' ||
    typeof skip !== 'number' ||
    typeof limit !== 'number' ||
    products.length !== payload['products'].length
  ) {
    throw new Error('El API devolvió productos con un formato inesperado.');
  }

  return { products, total, skip, limit };
}

function isDummyProduct(value: unknown): value is DummyProduct {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    typeof value['title'] === 'string' &&
    typeof value['category'] === 'string' &&
    typeof value['price'] === 'number' &&
    typeof value['stock'] === 'number' &&
    typeof value['rating'] === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
