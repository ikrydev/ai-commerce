export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  price: string;
  editable?: boolean;
}

interface Props extends Product {
  onClick: () => void;
}

const ProductCard = ({ onClick, ...product }: Props) => {
  return (
    <div>
      <div key={product.id} onClick={onClick} className="group">
        <img
          alt={product.title}
          src={product.imageUrl}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
        />
        <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {product.price}
        </p>
      </div>
      {product.editable && (
        <button className="mt-2 w-full rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
          Edit
        </button>
      )}
    </div>
  );
};

export default ProductCard;
