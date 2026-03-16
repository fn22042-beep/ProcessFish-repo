import jsPDF from 'jspdf';

interface OrderPDF {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  items: Array<{ product: { name: string }; weight: string; quantity: number; price: number }>;
}

export function generateOrderSlip(order: OrderPDF) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('Order Confirmation Slip', 20, 30);

  // Order details
  doc.setFontSize(12);
  doc.text(`Order Number: ${order.orderNumber}`, 20, 50);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);

  // Customer info
  doc.text('Customer Information:', 20, 80);
  doc.text(`Name: ${order.customerName}`, 20, 90);
  doc.text(`Email: ${order.email}`, 20, 100);
  doc.text(`Phone: ${order.phone}`, 20, 110);
  doc.text(`Address: ${order.address}`, 20, 120);

  // Items
  doc.text('Order Items:', 20, 140);
  let y = 150;
  order.items.forEach((item, _index) => {
    doc.text(`${item.product.name} (${item.weight}) x ${item.quantity} - $${item.price * item.quantity}`, 20, y);
    y += 10;
  });

  // Total
  doc.text(`Total: $${order.total.toFixed(2)}`, 20, y + 10);

  // Status
  doc.text(`Status: ${order.status}`, 20, y + 20);

  return doc.output('blob');
}