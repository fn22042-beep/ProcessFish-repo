import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  image: z.string().min(1),
  images: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),
  weights: z.array(z.string()).or(z.string()), // JSON string or array
  price: z.number().int().min(0),
  originalPrice: z.number().int().min(0).optional().nullable(),
  badge: z.string().optional().nullable(),
  badgeColor: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  iconName: z.string().optional().nullable(),
  countLabel: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
})

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  weight: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0),
})

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
  total: z.number().min(0).transform((n) => Math.round(n)),
  paymentMethod: z.enum(["card", "cod", "bkash", "nagad"]),
  paymentIntentId: z.string().optional(),
  transactionId: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
})

export const createTestimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(1),
  initials: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
