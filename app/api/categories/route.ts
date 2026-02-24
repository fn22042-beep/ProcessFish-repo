import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createCategorySchema } from "@/lib/validations"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        iconName: c.iconName,
        countLabel: c.countLabel,
        color: c.color,
        sortOrder: c.sortOrder,
        productCount: c._count.products,
      }))
    )
  } catch (e) {
    console.error("GET /api/categories", e)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        iconName: data.iconName ?? null,
        countLabel: data.countLabel ?? null,
        color: data.color ?? null,
        sortOrder: data.sortOrder ?? 0,
      },
    })
    return NextResponse.json(category)
  } catch (e) {
    console.error("POST /api/categories", e)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
