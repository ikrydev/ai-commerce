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
      <div onClick={onClick} key={product.id} className="group relative">
        <img
          alt={product.title}
          src={product.imageUrl}
          className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
        />
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <a href={product.link}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.title}
              </a>
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-900">{product.price}</p>
        </div>
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
