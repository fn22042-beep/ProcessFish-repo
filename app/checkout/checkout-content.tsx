"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

export function CheckoutContent() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  if (items.length === 0 && !orderNumber) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add items to your cart before checkout.
          </p>
          <Link href="/cart" className="mt-6 inline-block">
            <Button variant="outline">View Cart</Button>
          </Link>
        </div>
      </section>
    )
  }

  if (orderNumber) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order number is <strong className="text-foreground">{orderNumber}</strong>. We will contact you shortly for delivery.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/orders/${orderNumber}`}>
              <Button variant="outline">View Order</Button>
            </Link>
            <Link href="/">
              <Button className="bg-accent font-semibold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim() || undefined,
          notes: form.notes.trim() || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            weight: i.weight,
            quantity: i.quantity,
            price: i.price,
          })),
          total: totalAmount,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to place order. Please try again.")
        setLoading(false)
        return
      }
      setOrderNumber(data.orderNumber)
      clearCart()
      toast.success("Order placed successfully!")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Delivery Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                  placeholder="Your name"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Phone *</label>
                <Input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="01XXXXXXXX"
                  className="bg-background"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Address *</label>
                <Input
                  required
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="House, road, area"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">City / Area</label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Dhaka, Tangail"
                  className="bg-background"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Notes (optional)</label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Delivery instructions"
                  className="bg-background"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Order Summary</h3>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={`${item.productId}-${item.weight}`} className="flex gap-3 text-sm">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                    <Image src={item.image} alt="" fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.weight} × {item.quantity} — ৳{item.price * item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span style={{ color: "#1B1F6F" }}>৳{totalAmount}</span>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-accent font-semibold hover:bg-amber-400"
              style={{ color: "#1B1F6F" }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
            <Link href="/cart" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
              Back to cart
            </Link>
          </div>
        </div>
      </form>
    </section>
  )
}
