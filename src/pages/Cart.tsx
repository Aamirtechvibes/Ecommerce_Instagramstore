import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';

export const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Discover our beautiful collection of premium bags
          </p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    {item.color && (
                      <p className="text-sm text-gray-600 mb-2">{item.color}</p>
                    )}
                    <p className="text-lg font-semibold">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-semibold">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <Button fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link to="/products">
                <Button variant="ghost" fullWidth className="mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
