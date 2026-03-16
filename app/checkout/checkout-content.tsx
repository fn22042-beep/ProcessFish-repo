"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripeEnabled = !!stripePublishableKey
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : Promise.resolve(null)

type PaymentMethod = "card" | "cod" | "bkash" | "nagad"

// Checkout form component that uses Stripe hooks
function CheckoutForm() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCart()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    stripeEnabled ? "card" : "cod"
  )
  const [transactionId, setTransactionId] = useState("")
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  const isCardPayment = stripeEnabled && paymentMethod === "card"

  // Create payment intent when component mounts (শুধু কার্ডের জন্য)
  useEffect(() => {
    if (isCardPayment && items.length > 0 && totalAmount > 0 && !clientSecret) {
      createPaymentIntent()
    }
  }, [isCardPayment, items, totalAmount])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // amount in smallest currency unit (paisa)
          amount: Math.round(totalAmount * 100),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        toast.error("Failed to initialize payment")
      }
    } catch (error) {
      toast.error("Payment initialization failed")
    }
  }

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
            Your order number is <strong className="text-foreground">{orderNumber}</strong>. 
            {paymentMethod === "cod" && " We will contact you shortly for delivery and payment."}
            {(paymentMethod === "bkash" || paymentMethod === "nagad") && " Please complete your payment via the instructions sent to your phone."}
            {paymentMethod === "card" && " Payment completed successfully."}
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
      // Validate required fields
      if (!form.customerName || !form.email || !form.phone || !form.address) {
        toast.error("Please fill all required fields")
        setLoading(false)
        return
      }

      // For bKash/Nagad, transaction ID is required
      if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !transactionId) {
        toast.error(`Please enter your ${paymentMethod === "bkash" ? "bKash" : "Nagad"} transaction ID`)
        setLoading(false)
        return
      }

      let paymentIntentId: string | undefined

      // Handle card payment
      if (paymentMethod === "card" && stripeEnabled) {
        if (!stripe || !elements) {
          toast.error("Stripe not loaded")
          setLoading(false)
          return
        }

        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
          toast.error("Card element not found")
          setLoading(false)
          return
        }

        // Confirm payment with Stripe
        const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: form.customerName,
              email: form.email,
              phone: form.phone,
            },
          },
        })

        if (paymentError) {
          toast.error(paymentError.message || "Payment failed")
          setLoading(false)
          return
        }

        if (paymentIntent?.status !== "succeeded") {
          toast.error("Payment failed")
          setLoading(false)
          return
        }

        paymentIntentId = paymentIntent.id
      }

      // Prepare order data
      const orderData: any = {
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
        total: Math.round(totalAmount),
        paymentMethod,
      }

      // Add payment-specific fields
      if (paymentIntentId) {
        orderData.paymentIntentId = paymentIntentId
      }
      if (transactionId) {
        orderData.transactionId = transactionId
      }

      // Create order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
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
    } catch (error) {
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

          {/* Payment Method Selection */}
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {stripeEnabled && (
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Credit / Debit Card (Stripe)</span>
                </label>
              )}
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={paymentMethod === "bkash"}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">bKash</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="nagad"
                  checked={paymentMethod === "nagad"}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Nagad</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
            </div>

            {/* Payment-specific fields */}
            {paymentMethod === "card" && (
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Card Details *</label>
                <div className="rounded-md border border-input bg-background p-3">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your payment information is secure and encrypted.
                </p>
              </div>
            )}

            {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {paymentMethod === "bkash" ? "bKash" : "Nagad"} Transaction ID *
                </label>
                <Input
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  className="bg-background"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Send payment to our {paymentMethod === "bkash" ? "bKash" : "Nagad"} number: 01XXXXXXXXX
                </p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <p className="mt-4 text-sm text-muted-foreground">
                You will pay in cash upon delivery.
              </p>
            )}
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
              disabled={loading || (paymentMethod === "card" && (!stripe || !clientSecret))}
              className="mt-6 w-full bg-accent font-semibold hover:bg-amber-400"
              style={{ color: "#1B1F6F" }}
            >
              {loading ? "Processing..." : `Place Order`}
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

// Main component that provides Stripe Elements context
export function CheckoutContent() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}