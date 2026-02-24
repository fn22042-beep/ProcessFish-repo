import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { contactSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const contact = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject ?? null,
        message: parsed.data.message,
      },
    })
    return NextResponse.json({
      id: contact.id,
      message: "Thank you for your message. We will get back to you soon.",
    })
  } catch (e) {
    console.error("POST /api/contact", e)
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    )
  }
}
