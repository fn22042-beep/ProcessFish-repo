// Server-only data access. Use in Server Components.
// Returns empty arrays if DB is not available (e.g. before first run of db push).

import { prisma } from "@/lib/prisma"

export interface ProductData {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  image: string
  images: string[]
  rating: number
  reviews: number
  weights: string[]
  price: number
  originalPrice?: number
  badge?: string
  badgeColor?: string
  description?: string
  isFeatured: boolean
  isOnSale: boolean
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  iconName: string | null
  countLabel: string | null
  color: string | null
  sortOrder: number
  productCount: number
}

export interface TestimonialData {
  id: string
  name: string
  role: string | null
  rating: number
  text: string
  initials: string | null
  color: string | null
  sortOrder: number
}

export async function getProducts(options?: {
  categoryId?: string
  categorySlug?: string
  featured?: boolean
  onSale?: boolean
}): Promise<ProductData[]> {
  try {
    const where: Record<string, unknown> = {}
    if (options?.categoryId) where.categoryId = options.categoryId
    if (options?.categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: options.categorySlug } })
      if (cat) where.categoryId = cat.id
    }
    if (options?.featured) where.isFeatured = true
    if (options?.onSale) where.isOnSale = true

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    return products.map((p) => ({
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
  } catch {
    return []
  }
}

export async function getCategories(): Promise<CategoryData[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    })
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      iconName: c.iconName,
      countLabel: c.countLabel,
      color: c.color,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
    }))
  } catch {
    return []
  }
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  try {
    const list = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { sortOrder: "asc" },
    })
    return list.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      rating: t.rating,
      text: t.text,
      initials: t.initials,
      color: t.color,
      sortOrder: t.sortOrder,
    }))
  } catch {
    return []
  }
}
