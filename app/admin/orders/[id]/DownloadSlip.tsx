'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  createdAt: Date | string;
  items: Array<{
    id: string;
    product: { name: string };
    weight: string;
    quantity: number;
    price: number;
  }>;
}

interface DownloadSlipProps {
  order: Order;
}

export default function DownloadSlip({ order }: DownloadSlipProps) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('Order Confirmation Slip', 20, 30);

    // Order details
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 20, 50);
    const createdDate = order.createdAt instanceof Date 
      ? order.createdAt.toLocaleDateString() 
      : new Date(order.createdAt).toLocaleDateString();
    doc.text(`Date: ${createdDate}`, 20, 60);

    // Customer info
    doc.text('Customer Information:', 20, 80);
    doc.text(`Name: ${order.customerName}`, 20, 90);
    doc.text(`Email: ${order.email}`, 20, 100);
    doc.text(`Phone: ${order.phone}`, 20, 110);
    doc.text(`Address: ${order.address}`, 20, 120);

    // Items
    doc.text('Order Items:', 20, 140);
    let y = 150;
    order.items.forEach((item) => {
      doc.text(`${item.product.name} (${item.weight}) x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 20, y);
      y += 10;
    });

    // Total
    doc.text(`Total: $${order.total.toFixed(2)}`, 20, y + 10);

    // Status
    doc.text(`Status: ${order.status}`, 20, y + 20);

    // Download
    doc.save(`order-${order.orderNumber}.pdf`);
  };

  return (
    <div className="flex justify-center">
      <Button onClick={generatePDF} className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download Order Slip
      </Button>
    </div>
  );
}