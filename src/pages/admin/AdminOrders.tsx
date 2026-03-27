import { useEffect, useState } from 'react';
import { Package, Eye, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { canTransitionStatus, getNextAllowedStatuses } from '../../utils/orderStateMachine';
import { generateWhatsAppMessage, sendWhatsAppMessage } from '../../utils/whatsapp';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);

    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (data) setOrderItems(data);
    setShowModal(true);
  };

  const updateOrderStatus = async (
    orderId: string,
    currentStatus: Order['status'],
    newStatus: Order['status']
  ) => {
    if (!canTransitionStatus(currentStatus, newStatus)) {
      alert('Invalid status transition');
      return;
    }

    try {
      const updateData: Record<string, string> = { status: newStatus };

      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      await supabase.from('orders').update(updateData).eq('id', orderId);

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const sendOrderUpdate = (order: Order) => {
    const items = orderItems.map((item) => ({
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const message = generateWhatsAppMessage({
      customerName: order.customer_name,
      orderNumber: order.order_number,
      total: order.total,
      items,
      status: order.status,
      trackingId: order.tracking_id || undefined,
    });

    sendWhatsAppMessage(order.customer_phone, message);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-wide">Orders</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">
                    Order {order.order_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewOrderDetails(order)}
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Customer</p>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Shipping Address</p>
                  <p className="font-medium line-clamp-2">
                    {order.shipping_address}
                  </p>
                  <p className="text-gray-600">Pincode: {order.pincode}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                {getNextAllowedStatuses(order.status).map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateOrderStatus(order.id, order.status, nextStatus)
                    }
                  >
                    Mark as {nextStatus}
                  </Button>
                ))}
              </div>
            </Card>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No orders yet</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Order ${selectedOrder?.order_number}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Customer Name</p>
                <p className="font-medium">{selectedOrder.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Phone</p>
                <p className="font-medium">{selectedOrder.customer_phone}</p>
              </div>
              {selectedOrder.customer_email && (
                <div>
                  <p className="text-gray-600 mb-1">Email</p>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600 mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-1 text-sm">Shipping Address</p>
              <p className="font-medium">{selectedOrder.shipping_address}</p>
              <p className="text-sm text-gray-600">
                Pincode: {selectedOrder.pincode}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Order Items</h4>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => sendOrderUpdate(selectedOrder)}
                className="flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Send WhatsApp Update
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
