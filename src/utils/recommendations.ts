import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export const getRecommendedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] => {
  const scored = allProducts
    .filter((p) => p.id !== currentProduct.id && p.stock_quantity > 0)
    .map((product) => {
      let score = 0;

      if (product.category_id === currentProduct.category_id) {
        score += 10;
      }

      const priceDiff = Math.abs(product.price - currentProduct.price);
      if (priceDiff < 300) {
        score += 8;
      } else if (priceDiff < 500) {
        score += 5;
      } else if (priceDiff < 1000) {
        score += 2;
      }

      if (product.color === currentProduct.color) {
        score += 3;
      }

      if (product.material === currentProduct.material) {
        score += 2;
      }

      if (product.is_best_seller) {
        score += 5;
      }

      if (product.is_trending) {
        score += 3;
      }

      score += product.view_count * 0.01;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);

  return scored;
};

export const getBestSellers = (products: Product[], limit: number = 8): Product[] => {
  return products
    .filter((p) => p.is_best_seller && p.stock_quantity > 0)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
};

export const getTrendingProducts = (products: Product[], limit: number = 8): Product[] => {
  return products
    .filter((p) => p.is_trending && p.stock_quantity > 0)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
};

export const getNewArrivals = (products: Product[], limit: number = 8): Product[] => {
  return products
    .filter((p) => p.is_new_arrival && p.stock_quantity > 0)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const getTopPicks = (products: Product[], limit: number = 4): Product[] => {
  return products
    .filter((p) => p.is_top_pick && p.stock_quantity > 0)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
};
