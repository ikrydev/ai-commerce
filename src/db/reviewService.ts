import { openDB } from './indexedDB';
import { Review } from '../models/types/review';

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<IDBValidKey> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('reviews', 'readwrite');
    const store = tx.objectStore('reviews');
    const request = store.add({ ...review, createdAt: Date.now() });

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getReviews(): Promise<Review[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('reviews', 'readonly');
    const store = tx.objectStore('reviews');
    const index = store.index('productId');
    const request = index.getAll(IDBKeyRange.only('productId'));

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
