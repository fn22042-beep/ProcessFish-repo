import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { newsletterSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const email = parsed.data.email
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })
    if (existing) {
      if (existing.active) {
        return NextResponse.json({
          message: "You are already subscribed to our newsletter.",
        })
      }
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { active: true },
      })
      return NextResponse.json({
        message: "You have been re-subscribed to our newsletter.",
      })
    }
    await prisma.newsletterSubscriber.create({
      data: { email },
    })
    return NextResponse.json({
      message: "Thank you for subscribing! Check your inbox for exclusive deals.",
    })
  } catch (e) {
    console.error("POST /api/newsletter", e)
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}
