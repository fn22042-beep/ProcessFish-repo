import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createTestimonialSchema } from "@/lib/validations"

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(testimonials)
  } catch (e) {
    console.error("GET /api/testimonials", e)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createTestimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        role: parsed.data.role ?? null,
        rating: parsed.data.rating ?? 5,
        text: parsed.data.text,
        initials: parsed.data.initials ?? null,
        color: parsed.data.color ?? null,
        sortOrder: parsed.data.sortOrder ?? 0,
        approved: true,
      },
    })
    return NextResponse.json(testimonial)
  } catch (e) {
    console.error("POST /api/testimonials", e)
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}
