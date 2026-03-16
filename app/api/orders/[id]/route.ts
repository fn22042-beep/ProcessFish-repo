import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    // ১. প্রথমে চেক করা যে এই আইডি বা অর্ডার নাম্বার দিয়ে কোনো অর্ডার আছে কি না
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id }
        ]
      }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found with the provided ID or Order Number' },
        { status: 404 }
      );
    }

    // ২. অর্ডার পাওয়া গেলে সেটি আপডেট করা
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id }, // আসল Primary Key (id) ব্যবহার করে আপডেট
      data: { status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    const err = error as Record<string, string>;
    console.error('Error updating order status:', error);
    
    // Prisma এর নির্দিষ্ট এরর হ্যান্ডলিং (P2025 মানে রেকর্ড পাওয়া যায়নি)
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Order record not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}