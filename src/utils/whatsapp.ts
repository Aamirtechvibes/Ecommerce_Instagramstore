export interface WhatsAppMessageData {
  customerName: string;
  orderNumber: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  trackingId?: string;
}

export const generateWhatsAppMessage = (data: WhatsAppMessageData): string => {
  const { customerName, orderNumber, total, items, status, trackingId } = data;

  let message = `Hello ${customerName}! 🛍️\n\n`;

  if (status === 'confirmed') {
    message += `✅ Your order has been confirmed!\n\n`;
  } else if (status === 'shipped') {
    message += `📦 Your order has been shipped!\n\n`;
    if (trackingId) {
      message += `Tracking ID: ${trackingId}\n\n`;
    }
  } else if (status === 'delivered') {
    message += `🎉 Your order has been delivered!\n\n`;
  } else {
    message += `Thank you for your order with Bin Hashim!\n\n`;
  }

  message += `Order Number: ${orderNumber}\n\n`;
  message += `Items:\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
  });

  message += `\nTotal: ₹${total}\n\n`;

  if (status === 'pending' || !status) {
    message += `We'll confirm your order shortly. You'll receive updates via WhatsApp.\n\n`;
  }

  message += `Thank you for shopping with Bin Hashim! 💼✨`;

  return message;
};

export const sendWhatsAppMessage = (phoneNumber: string, message: string): void => {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(url, '_blank');
};
