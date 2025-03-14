import type { Product } from '@/models/types/product';

const DB_NAME = 'ecommerceDB';
const DB_VERSION = 1;

const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Laptop',
    description: 'A powerful laptop',
    price: 1200,
    image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
    createdAt: Date.now(),
  },
  {
    id: 2,
    title: 'Smartphone',
    description: 'Latest smartphone model',
    price: 800,
    image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
    createdAt: Date.now(),
  },
];

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('title', 'title', { unique: false });

        initialProducts.forEach(product => productStore.add(product));
      }

      if (!db.objectStoreNames.contains('reviews')) {
        const reviewStore = db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
        reviewStore.createIndex('productId', 'productId', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
