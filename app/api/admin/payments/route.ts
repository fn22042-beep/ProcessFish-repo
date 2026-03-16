import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const codPayments = payments.filter(p => p.method === 'COD');
    const onlinePayments = payments.filter(p => p.method === 'Online');
    const pendingRefunds = payments.filter(p => p.status === 'refund_pending').reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      payments,
      summary: {
        totalRevenue,
        codRevenue: codPayments.reduce((sum, p) => sum + p.amount, 0),
        onlineRevenue: onlinePayments.reduce((sum, p) => sum + p.amount, 0),
        pendingRefunds,
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}