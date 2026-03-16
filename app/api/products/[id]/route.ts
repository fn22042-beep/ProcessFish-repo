import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({
      ...product,
      weights: JSON.parse(product.weights) as string[],
      images: product.images ? (JSON.parse(product.images) as string[]) : [],
    })
  } catch (e) {
    console.error("GET /api/products/[id]", e)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const raw = { ...body, weights: Array.isArray(body.weights) ? JSON.stringify(body.weights) : body.weights }
    const parsed = createProductSchema.partial().safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const update: Record<string, unknown> = {}
    if (data.name != null) update.name = data.name
    if (data.slug != null) update.slug = data.slug
    if (data.categoryId != null) update.categoryId = data.categoryId
    if (data.image != null) update.image = data.image
    if (data.images != null) update.images = data.images
    if (data.rating != null) update.rating = data.rating
    if (data.reviewsCount != null) update.reviewsCount = data.reviewsCount
    if (data.weights != null) update.weights = typeof data.weights === "string" ? data.weights : JSON.stringify(data.weights)
    if (data.price != null) update.price = data.price
    if (data.originalPrice !== undefined) update.originalPrice = data.originalPrice
    if (data.badge !== undefined) update.badge = data.badge
    if (data.badgeColor !== undefined) update.badgeColor = data.badgeColor
    if (data.description !== undefined) update.description = data.description
    if (data.isFeatured != null) update.isFeatured = data.isFeatured
    if (data.isOnSale != null) update.isOnSale = data.isOnSale

    const product = await prisma.product.update({
      where: { id },
      data: update as Parameters<typeof prisma.product.update>[0]["data"],
      include: { category: true },
    })
    return NextResponse.json(product)
  } catch (e) {
    console.error("PUT /api/products/[id]", e)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("DELETE /api/products/[id]", e)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
