import { openDB } from './indexedDB';
import { Product } from '../models/types/product';

export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<IDBValidKey> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const request = store.add({ ...product, createdAt: Date.now() });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getProducts(): Promise<Product[]> {
  const db = await openDB();
  const tx = db.transaction('products', 'readonly');
  const store = tx.objectStore('products');

  return store.getAll() as unknown as Promise<Product[]>;
}
