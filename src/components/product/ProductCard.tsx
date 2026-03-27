import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Database } from '../../lib/database.types';
import { useCartStore } from '../../store/cartStore';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      color: product.color || '',
    });
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-square mb-3">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag size={48} />
          </div>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-semibold bg-black text-white rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">
            {discount}% OFF
          </div>
        )}

        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}

        {product.stock_quantity > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          >
            <ShoppingBag size={20} />
          </button>
        )}
      </div>

      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        <h3 className={`font-medium text-gray-900 line-clamp-2 ${compact ? 'text-sm' : 'text-base'}`}>
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
            ₹{product.price.toLocaleString()}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className={`text-gray-400 line-through ${compact ? 'text-xs' : 'text-sm'}`}>
              ₹{product.mrp.toLocaleString()}
            </span>
          )}
        </div>

        {product.color && !compact && (
          <p className="text-sm text-gray-600">{product.color}</p>
        )}
      </div>
    </Link>
  );
};
