import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { Button } from '../components/ui/Button';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', orderId).maybeSingle(),
        supabase.from('order_items').select('*').eq('order_id', orderId),
      ]);

      if (orderRes.data) setOrder(orderRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
    } catch (error) {
      console.error('Error fetching order:', error);
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

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Order not found</h2>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-light tracking-wide mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation shortly.
          </p>
          <div className="inline-block bg-gray-50 px-6 py-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-semibold">{order.order_number}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Package size={24} />
            <h2 className="text-xl font-medium">Order Details</h2>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-0">
                <div>
                  <h4 className="font-medium">{item.product_name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.subtotal.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="text-xl font-semibold">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{order.customer_phone}</p>
            </div>
            {order.customer_email && (
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
            )}
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-medium">{order.shipping_address}</p>
              <p className="font-medium">Pincode: {order.pincode}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-medium mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• You'll receive order updates via WhatsApp</li>
            <li>• We'll confirm your order within 24 hours</li>
            <li>• Your order will be carefully packed and shipped</li>
            <li>• Track your order status anytime</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link to="/" className="flex-1">
            <Button variant="outline" fullWidth>
              <Home className="mr-2" size={20} />
              Back to Home
            </Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button fullWidth>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
