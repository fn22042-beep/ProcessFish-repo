import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("category")
    const featured = searchParams.get("featured")
    const onSale = searchParams.get("onSale")

    const where: Record<string, unknown> = {}
    if (categoryId) where.categoryId = categoryId
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } })
      if (cat) where.categoryId = cat.id
    }
    if (featured === "true") where.isFeatured = true
    if (onSale === "true") where.isOnSale = true

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      categoryId: p.categoryId,
      image: p.image,
      images: p.images ? (JSON.parse(p.images) as string[]) : [],
      rating: p.rating,
      reviews: p.reviewsCount,
      weights: JSON.parse(p.weights) as string[],
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      badge: p.badge ?? undefined,
      badgeColor: p.badgeColor ?? undefined,
      description: p.description ?? undefined,
      isFeatured: p.isFeatured,
      isOnSale: p.isOnSale,
    }))

    return NextResponse.json(mapped)
  } catch (e) {
    console.error("GET /api/products", e)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const raw = { ...body, weights: Array.isArray(body.weights) ? JSON.stringify(body.weights) : body.weights }
    const parsed = createProductSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data
    const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        image: data.image,
        images: data.images ?? null,
        rating: data.rating ?? 0,
        reviewsCount: data.reviewsCount ?? 0,
        weights: typeof data.weights === "string" ? data.weights : JSON.stringify(data.weights),
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        badge: data.badge ?? null,
        badgeColor: data.badgeColor ?? null,
        description: data.description ?? null,
        isFeatured: data.isFeatured ?? false,
        isOnSale: data.isOnSale ?? false,
      },
      include: { category: true },
    })
    return NextResponse.json(product)
  } catch (e) {
    console.error("POST /api/products", e)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
