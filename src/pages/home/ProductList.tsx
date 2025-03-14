import { useState } from 'react';
import ProductCard, { Product } from '../../components/product-card';
import ProductPoppup from '../../components/product-popup';
import CreatePopup from '../../components/create-popup';

import ProductReview from './ProductReview';

const products = [
  {
    id: '1',
    title: 'Basic Tee',
    link: '#',
    imageUrl:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
    price: 'Rp3,000,000',
    editable: true,
  },
  {
    id: '2',
    title: 'Basic Tee',
    link: '#',
    imageUrl:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg',
    price: 'Rp3,000,000',
    editable: true,
  },
  {
    id: '3',
    title: 'Basic Tee',
    link: '#',
    imageUrl:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg',
    price: 'Rp3,000,000',
    editable: true,
  },
  {
    id: '4',
    title: 'Basic Tee',
    link: '#',
    imageUrl:
      'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg',
    price: 'Rp3,000,000',
    editable: true,
  },
];

const DEFAULT_PRODUCT = {
  id: '',
  title: '',
  link: '',
  imageUrl: '',
  price: '',
  editable: false,
};

const ProductList = () => {
  const [activeProduct, setActiveProduct] = useState<Product>(DEFAULT_PRODUCT);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  const handleClosePopup = () => {
    setActiveProduct({
      ...activeProduct,
      id: '',
    });

    setTimeout(() => {
      setActiveProduct(DEFAULT_PRODUCT);
    }, 300);
  };

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Products
            </h2>

            <button className="w-50 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" onClick={() => setShowCreatePopup(true)}>
              Add Product
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                onClick={() => setActiveProduct(product)}
                {...product}
              />
            ))}
          </div>
        </div>
      </div>

      <ProductPoppup
        show={Boolean(activeProduct.id)}
        onClose={handleClosePopup}
        active={activeProduct}
      >
        <ProductReview />
      </ProductPoppup>

      <CreatePopup open={showCreatePopup} onClose={() => setShowCreatePopup(false)} />
    </>
  );
};

export default ProductList;
