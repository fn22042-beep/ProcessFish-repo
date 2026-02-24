import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createOrderSchema } from "@/lib/validations"

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
        status: "pending",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            weight: item.weight,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })

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
