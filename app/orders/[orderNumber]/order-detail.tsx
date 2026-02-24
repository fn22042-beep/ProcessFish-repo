"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface OrderData {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string | null
  notes: string | null
  total: number
  status: string
  createdAt: string
  items: {
    productId: string
    productName: string
    weight: string
    quantity: number
    price: number
    subtotal: number
  }[]
}

export function OrderDetail({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found")
        return res.json()
      })
      .then(setOrder)
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Loading order...
        </div>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-foreground">{error ?? "Order not found."}</p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </section>
    )
  }

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }
  const statusClass = statusColors[order.status] ?? "bg-muted text-muted-foreground"

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-bold text-foreground">Order {order.orderNumber}</h1>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Delivery Info</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>{order.customerName}</li>
            <li>{order.email}</li>
            <li>{order.phone}</li>
            <li>{order.address}{order.city ? `, ${order.city}` : ""}</li>
            {order.notes && <li className="pt-2">Note: {order.notes}</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">Items</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.weight}`} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.weight} × {item.quantity} — ৳{item.subtotal}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
            <span>Total</span>
            <span style={{ color: "#1B1F6F" }}>৳{order.total}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button className="bg-accent font-semibold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
            Back to Home
          </Button>
        </Link>
      </div>
    </section>
  )
}
