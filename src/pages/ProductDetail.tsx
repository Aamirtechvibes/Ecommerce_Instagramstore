import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { getRecommendedProducts } from '../utils/recommendations';

type Product = Database['public']['Tables']['products']['Row'];

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const [productRes, allProductsRes] = await Promise.all([
        supabase.from('products').select('*').eq('slug', slug).maybeSingle(),
        supabase.from('products').select('*').gt('stock_quantity', 0),
      ]);

      if (productRes.data) {
        setProduct(productRes.data);

        await supabase
          .from('products')
          .update({ view_count: (productRes.data.view_count || 0) + 1 })
          .eq('id', productRes.data.id);
      }

      if (allProductsRes.data) {
        setAllProducts(allProductsRes.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Product not found</h2>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const recommendedProducts = getRecommendedProducts(product, allProducts, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        color: product.color || '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-8"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingBag size={64} />
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {product.video_url && (
              <div className="mt-4">
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag size={20} />
                  Watch Instagram Reel
                </a>
              </div>
            )}
          </div>

          <div>
            <div className="mb-6">
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-semibold">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {product.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              <div className="space-y-3 mb-6">
                {product.color && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-24">
                      Color:
                    </span>
                    <span className="text-sm">{product.color}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-24">
                      Material:
                    </span>
                    <span className="text-sm">{product.material}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-24">
                    Stock:
                  </span>
                  <span
                    className={`text-sm ${
                      product.stock_quantity > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} available`
                      : 'Out of stock'}
                  </span>
                </div>
              </div>

              {product.stock_quantity > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock_quantity, quantity + 1)
                          )
                        }
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      fullWidth
                    >
                      Add to Cart
                    </Button>
                    <Link to="/checkout" className="flex-1">
                      <Button fullWidth>Buy Now</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {recommendedProducts.length > 0 && (
          <section className="border-t pt-16">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {recommendedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
