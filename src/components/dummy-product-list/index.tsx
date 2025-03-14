import { useState, useEffect } from 'react';
import { Product } from '../../models/types/product';
import { addProduct, getProducts } from '../../db/productService';

export default function ProductManager() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    const storedProducts = await getProducts();
    setProducts(storedProducts);
  }

  async function handleAddProduct() {
    if (!title.trim()) return alert('Title is required');

    await addProduct({ title, description: 'auto generated description', price, image: '' });
    setTitle('');
    setPrice(0);
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Product Manager</h2>
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} />
      <button onClick={handleAddProduct}>Add Product</button>

      {/* <h3>Product List</h3>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title} - {product.price}
          </li>
        ))}
      </ul> */}
    </div>
  );
}
