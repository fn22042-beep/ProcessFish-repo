import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createOrderSchema } from "@/lib/validations"
import { sendOrderNotification } from '@/lib/notifications'

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  for (let i = 0; i < 10; i++) {
    const n = Math.floor(Math.random() * 99999) + 1
    const num = `PF-${year}-${String(n).padStart(5, "0")}`
    const existing = await prisma.order.findUnique({ where: { orderNumber: num } })
    if (!existing) return num
  }
  return `PF-${year}-${Date.now().toString(36).toUpperCase()}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const orderNumber = await generateOrderNumber()

    // Determine order and payment status based on payment method
    let orderStatus = "pending"
    let paymentStatus = "pending"
    
    if (data.paymentMethod === "card" && data.paymentIntentId) {
      orderStatus = "confirmed"
      paymentStatus = "completed"
    } else if (data.paymentMethod === "cod") {
      orderStatus = "confirmed"
      paymentStatus = "pending" // Payment will be collected on delivery
    } else if (data.paymentMethod === "bkash" || data.paymentMethod === "nagad") {
      orderStatus = "pending" // Wait for payment confirmation
      paymentStatus = "pending" // Will be verified by admin
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city ?? null,
        notes: data.notes ?? null,
        total: data.total,
        status: orderStatus,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            weight: item.weight,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        payments: {
          create: {
            method: data.paymentMethod,
            amount: data.total,
            status: paymentStatus,
            transactionId: data.transactionId || data.paymentIntentId || null,
          },
        },
      },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
    })

    // Notify admin (email) about new order — best-effort, do not block response
    try {
      sendOrderNotification({ ...order, customerEmail: order.email })
    } catch (e) {
      console.error('notify admin failed', e)
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items,
    })
  } catch (e) {
    console.error("POST /api/orders", e)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}