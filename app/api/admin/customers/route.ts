import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });

    const customerMap = new Map();

    orders.forEach(order => {
      const key = order.email;
      if (customerMap.has(key)) {
        const customer = customerMap.get(key);
        customer.totalOrders++;
        customer.totalSpent += order.total;
      } else {
        customerMap.set(key, {
          email: order.email,
          name: order.customerName,
          phone: order.customerPhone,
          totalOrders: 1,
          totalSpent: order.total,
        });
      }
    });

    const customers = Array.from(customerMap.values());

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}