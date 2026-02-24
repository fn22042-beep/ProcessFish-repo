// Server-side data fetching (use in Server Components).
// Falls back to empty arrays if DB is not set up yet.

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export interface ApiProduct {
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

export interface ApiCategory {
  id: string
  name: string
  slug: string
  iconName: string | null
  countLabel: string | null
  color: string | null
  sortOrder: number
  productCount: number
}

export interface ApiTestimonial {
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
  category?: string
  featured?: boolean
  onSale?: boolean
}): Promise<ApiProduct[]> {
  try {
    const params = new URLSearchParams()
    if (options?.categoryId) params.set("categoryId", options.categoryId)
    if (options?.category) params.set("category", options.category)
    if (options?.featured) params.set("featured", "true")
    if (options?.onSale) params.set("onSale", "true")
    const url = `${base}/api/products${params.toString() ? `?${params}` : ""}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${base}/api/categories`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getTestimonials(): Promise<ApiTestimonial[]> {
  try {
    const res = await fetch(`${base}/api/testimonials`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
