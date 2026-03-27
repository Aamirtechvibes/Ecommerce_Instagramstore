import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

type Product = Database['public']['Tables']['products']['Row'];

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const newStock = product.stock_quantity > 0 ? 0 : 10;
      await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, stock_quantity: newStock } : p
        )
      );
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-wide">Products</h1>
        <Link to="/admin/products/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">₹{product.price.toLocaleString()}</p>
                    {product.mrp && (
                      <p className="text-sm text-gray-400 line-through">
                        ₹{product.mrp.toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStock(product)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.is_trending && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Trending
                        </span>
                      )}
                      {product.is_new_arrival && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          New
                        </span>
                      )}
                      {product.is_best_seller && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
