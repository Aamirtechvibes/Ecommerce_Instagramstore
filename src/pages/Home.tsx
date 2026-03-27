import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { getTopPicks, getTrendingProducts, getBestSellers, getNewArrivals } from '../utils/recommendations';


type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const instagramReels = [
  {
    url: 'https://www.instagram.com/reel/DV1Q2J_CJVw/',
    label: 'Store Walkthrough',
    note: 'Inside the shop',
  },
  {
    url: 'https://www.instagram.com/reel/DVvh0ISDJQT/',
    label: 'Customer Moment',
    note: 'Real review clip',
  },
  {
    url: 'https://www.instagram.com/reel/DWHF2GtjOU3/',
    label: 'Store Visit',
    note: 'Behind the counter',
  },
  {
    url: 'https://www.instagram.com/reel/DWELQqdDB6d/',
    label: 'Gifting Set',
    note: 'Featured combo',
  },
];

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

  useEffect(() => {
    const instagramWindow = window as Window & {
      instgrm?: {
        Embeds?: {
          process: () => void;
        };
      };
    };

    const processEmbeds = () => instagramWindow.instgrm?.Embeds?.process();
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-instagram-embed-script="true"]');

    if (existingScript) {
      processEmbeds();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.setAttribute('data-instagram-embed-script', 'true');
    script.onload = processEmbeds;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
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
                <Button  className="inline-flex items-center gap-2 
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
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-4 pb-4">
                {trending.map((product) => (
                  <div key={product.id} className="flex-none w-48 md:w-64">
                    <ProductCard product={product} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-[linear-gradient(180deg,#f7f4ee_0%,#efe7db_100%)] border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.22em] uppercase text-black/60 mb-5">
                <Instagram size={16} />
                Social Showcase
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-[0.02em] text-neutral-900 mb-4">
                The Store, The Styling, The Real Customer Energy
              </h2>
              <p className="text-base md:text-lg text-neutral-600 max-w-xl leading-8">
                A more editorial look at Bin Hashim. Browse the latest reels, customer visits, and in-store highlights without leaving the page.
              </p>
            </div>
            <a
              href="https://www.instagram.com/bin_hashim_0555?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium tracking-wide text-white transition-transform hover:-translate-y-0.5"
            >
              Open Instagram Profile
            </a>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 pb-4">
            <div className="flex gap-6 w-max min-w-full">
              {instagramReels.map((reel) => (
                <div
                  key={reel.url}
                  className="flex-none w-[320px] md:w-[360px] rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,244,238,0.98)_100%)] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4 px-2 pb-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                        {reel.note}
                      </div>
                      <div className="text-lg font-medium text-neutral-900">
                        {reel.label}
                      </div>
                    </div>
                    <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-medium text-neutral-600">
                      Reel
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[22px] bg-white ring-1 ring-black/5">
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={`${reel.url}?utm_source=ig_embed&utm_campaign=loading`}
                      data-instgrm-version="14"
                      style={{
                        background: '#FFF',
                        border: 0,
                        borderRadius: '0',
                        boxShadow: 'none',
                        margin: '0 auto',
                        maxWidth: '540px',
                        minWidth: '280px',
                        padding: 0,
                        width: '100%',
                      }}
                    >
                      <div style={{ padding: '16px' }}>
                        <a
                          href={`${reel.url}?utm_source=ig_embed&utm_campaign=loading`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: '#FFFFFF',
                            lineHeight: 0,
                            padding: '0',
                            textAlign: 'center',
                            textDecoration: 'none',
                            width: '100%',
                            display: 'block',
                          }}
                        >
                          View this post on Instagram
                        </a>
                      </div>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                      <span className="text-2xl font-light">{category.name}</span>
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
