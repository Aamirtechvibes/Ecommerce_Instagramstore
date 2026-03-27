import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filterParam = searchParams.get('filter');
  const categoryParam = searchParams.get('category');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || '');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popular'>('popular');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filterParam, categoryParam]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');

    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock_quantity', 0);

      if (filterParam === 'trending') {
        query = query.eq('is_trending', true);
      } else if (filterParam === 'new') {
        query = query.eq('is_new_arrival', true);
      } else if (filterParam === 'best-sellers') {
        query = query.eq('is_best_seller', true);
      } else if (filterParam === 'premium') {
        query = query.gte('price', 1000);
      }

      if (categoryParam) {
        const category = categories.find((c) => c.slug === categoryParam);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data } = await query;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedCategory) {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        filtered = filtered.filter((p) => p.category_id === category.id);
      }
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => b.view_count - a.view_count);
    }

    return filtered;
  };

  const filteredProducts = applyFilters();

  const getPageTitle = () => {
    if (filterParam === 'trending') return 'Trending Bags';
    if (filterParam === 'new') return 'New Arrivals';
    if (filterParam === 'best-sellers') return 'Best Sellers';
    if (filterParam === 'premium') return 'Premium Collection';
    if (categoryParam) {
      const category = categories.find((c) => c.slug === categoryParam);
      return category?.name || 'Products';
    }
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide">
            {getPageTitle()}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <SlidersHorizontal size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside
            className={`md:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Filter size={18} />
                  Filters
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedCategory('');
                  setSortBy('popular');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </div>
            <ProductGrid products={filteredProducts} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};
