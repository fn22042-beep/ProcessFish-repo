"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export function CartContent() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/30 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add some fresh fish from our products and come back to place your order.
          </p>
          <Link href="/products" className="mt-8">
            <Button className="bg-accent font-semibold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
              Shop Products
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Shopping Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{totalItems} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.weight}`}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-20 w-20 object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.weight}</p>
                  <p className="mt-1 font-bold" style={{ color: "#1B1F6F" }}>
                    ৳{item.price} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.weight, Math.max(0, item.quantity - 1))
                    }
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.productId, item.weight, item.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.productId, item.weight)}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right font-bold" style={{ color: "#1B1F6F" }}>
                  ৳{item.price * item.quantity}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground">Order Summary</h3>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-medium text-foreground">৳{totalAmount}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Delivery charge may apply at checkout.
            </p>
            <div className="mt-6 flex justify-between border-t border-border pt-4 text-lg font-bold">
              <span>Total</span>
              <span style={{ color: "#1B1F6F" }}>৳{totalAmount}</span>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button
                className="w-full bg-accent font-semibold hover:bg-amber-400"
                style={{ color: "#1B1F6F" }}
              >
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/products" className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
