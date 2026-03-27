import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isAdmin = useAuthStore((state) => state.isAdmin);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
  to="/"
  className="text-[22px] md:text-[26px] text-black/80 leading-none tracking-normal hover:opacity-80 transition"
  style={{ fontFamily: 'Allura, cursive', fontWeight: 500 , letterSpacing: '0.02em' }} >
  Bin Hashim
</Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium hover:text-gray-600 transition-colors">
              All Bags
            </Link>
            <Link to="/products?filter=new" className="text-sm font-medium hover:text-gray-600 transition-colors">
              New In
            </Link>
            <Link to="/products?filter=premium" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Premium
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User size={20} />
              </Link>
            )}
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/products"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Bags
              </Link>
              <Link
                to="/products?filter=new"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New In
              </Link>
              <Link
                to="/products?filter=premium"
                className="text-sm font-medium hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Premium Collection
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
