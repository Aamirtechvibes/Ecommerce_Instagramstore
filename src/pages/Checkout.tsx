import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { generateWhatsAppMessage } from '../utils/whatsapp';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
  customerEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  shippingAddress: z.string().min(10, 'Please enter complete address'),
  pincode: z.string().min(6, 'Please enter a valid pincode'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const total = getTotalPrice();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    try {
      const orderNumber = `BH${Date.now()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          customer_email: data.customerEmail || null,
          shipping_address: data.shippingAddress,
          pincode: data.pincode,
          subtotal: total,
          discount: 0,
          total,
          status: 'pending',
          notes: data.notes || null,
          payment_method: 'razorpay',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const whatsappMessage = generateWhatsAppMessage({
        customerName: data.customerName,
        orderNumber,
        total,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      console.log('WhatsApp Message:', whatsappMessage);

      clearCart();

      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium mb-6">Contact Information</h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register('customerName')}
                  error={errors.customerName?.message}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register('customerPhone')}
                  error={errors.customerPhone?.message}
                />
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="Enter your email"
                  {...register('customerEmail')}
                  error={errors.customerEmail?.message}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-medium mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <Textarea
                  label="Complete Address"
                  placeholder="House No., Street, Landmark, City, State"
                  rows={4}
                  {...register('shippingAddress')}
                  error={errors.shippingAddress?.message}
                />
                <Input
                  label="Pincode"
                  placeholder="Enter pincode"
                  {...register('pincode')}
                  error={errors.pincode?.message}
                />
                <Textarea
                  label="Additional Notes (Optional)"
                  placeholder="Any special instructions for delivery"
                  rows={3}
                  {...register('notes')}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
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

              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
