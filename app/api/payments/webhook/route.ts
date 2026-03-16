import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } catch (err: unknown) {
      const error = err as Record<string, string>;
      console.error(`Webhook signature verification failed.`, error.message)
      return NextResponse.json({ error: "Webhook error" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        // Update order status to paid
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "confirmed",
            payments: {
              create: {
                amount: paymentIntent.amount / 100, // Convert from cents
                method: "stripe",
                status: "paid",
                transactionId: paymentIntent.id,
              },
            },
          },
        })

        console.log(`Payment succeeded for order ${orderId}`)
        break

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        const failedOrderId = failedPaymentIntent.metadata.orderId

        // Update payment status to failed
        await prisma.payment.create({
          data: {
            orderId: failedOrderId,
            amount: failedPaymentIntent.amount / 100,
            method: "stripe",
            status: "failed",
            transactionId: failedPaymentIntent.id,
          },
        })

        console.log(`Payment failed for order ${failedOrderId}`)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}