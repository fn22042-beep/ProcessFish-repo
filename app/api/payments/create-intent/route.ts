import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json()

    // `amount` is expected in the smallest currency unit (paisa)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "bdt",
      metadata: orderId
        ? {
            orderId,
          }
        : undefined,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}