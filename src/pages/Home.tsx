import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { getTopPicks, getTrendingProducts, getBestSellers, getNewArrivals } from '../utils/recommendations';


type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');

    const listener = () => setIsMobile(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, []);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').gt('stock_quantity', 0),
        supabase.from('categories').select('*').order('display_order'),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const topPicks = getTopPicks(products, 4);
  const trending = getTrendingProducts(products, 8);
  const bestSellers = getBestSellers(products, 8);
  const newArrivals = getNewArrivals(products, 8);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[92vh] lg:min-h-screen overflow-hidden">
        <style>{`
          @keyframes heroImageZoom {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
          }
          @keyframes heroFadeIn {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isMobile
              ? "url('https://ik.imagekit.io/aamir010/Bin%20hashim%20E%20commerce/Gemini_Generated_Image_3qv8mo3qv8mo3qv8%20(1).png')"
              : "url('https://ik.imagekit.io/aamir010/Bin%20hashim%20E%20commerce/Gemini_Generated_Image_cdnetqcdnetqcdne.png')",
            backgroundSize: 'cover',
            backgroundPosition: isMobile ? 'center top' : 'center',
            animation: 'heroImageZoom 1.8s ease-out forwards',
            transformOrigin: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:from-black/20 lg:to-black/25" />

        <div className="w-full pb-8 sm:pb-10 lg:pb-0  lg:max-w-2xl relative min-h-[92vh] lg:min-h-screen max-w-md mx-auto px-4 sm:px-6 lg:px-8 flex items-end lg:items-center ">
          <div
            className="w-full pb-8 sm:pb-10 lg:pb-0 text-left lg:max-w-2xl max-w-md "
            style={{ animation: 'heroFadeIn 0.9s ease-out both' }}
          >
            <p className="text-xs sm:text-sm uppercase text-[10px]
                          tracking-[0.22em]
                          text-white/70 mb-4
                          lg:text-center">
              Curated by Bin Hashim
            </p>
            <h1 className="text-[24px] sm:text-[28px] lg:text-[36px] font-light leading-[1.2] tracking-[-0.01em] text-white mb-3 lg:text-center">
              Premium Bags And More
            </h1>
            <p className="text-[14px] sm:text-[15px] lg:text-[16px]
                          text-white/75
                          leading-relaxed max-w-xl lg:max-w-2xl lg:mx-auto mb-7
                          lg:text-center">
              Handpicked styles trusted by thousand's on Instagram
            </p>
            <div className="flex flex-row gap-3 flex-wrap justify-start lg:justify-start lg:mt-6 flex lg:justify-center">
              <Link to="/products" className="w-fit lg:w-auto">
                <Button className="inline-flex items-center gap-2 
             px-5 py-2.5
             border border-black/90
             bg-black/80 text-white
             text-[14px] font-medium
             rounded-full
             backdrop-blur-md
             hover:bg-white/60 hover:text-black/80  hover:border-white/70 transition w-fit">
                  Shop Collection <ArrowRight size={14} />
                </Button>
              </Link>
              <Link to="/products?filter=trending" className="w-fit lg:w-auto">
                <Button variant="outline" className="inline-flex items-center gap-2
             px-5 py-2.5 
             text-white
             text-[14px] font-medium
             border border-white/50
             rounded-full
             hover:bg-white/60 hover:text-black/80 transition w-fit">
                  View Trending
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {topPicks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8 text-center">
            Today's Top Picks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">
                Trending Bags
              </h2>
              <Link to="/products?filter=trending" className="text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="w-full overflow-hidden">
              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-4 w-fit">
                  {trending.map((product) => (
                    <div key={product.id} className="flex-none w-48 md:w-64">
                      <ProductCard product={product} compact />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Instagram showcase section temporarily disabled while investigating layout overflow. */}

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 border border-gray-200 hover:shadow-lg transition-shadow">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-2xl text-center font-light">{category.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-center font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide">
              Best Sellers
            </h2>
            <Link to="/products?filter=best-sellers" className="text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide">
                New Arrivals
              </h2>
              <Link to="/products?filter=new" className="text-sm font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
          Premium Quality, Affordable Prices
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience luxury fashion without the luxury price tag. Our curated collection brings you the latest trends in bags and accessories.
        </p>
        <Link to="/products">
          <Button size="lg" variant="outline">
            Shop All Products
          </Button>
        </Link>
      </section>
    </div>
  );
};
