import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categoriesData = [
  { name: "All Fish", slug: "all-fish", iconName: "Fish", countLabel: "200+ varieties", color: "#1B1F6F", sortOrder: 0 },
  { name: "Frozen Fish", slug: "frozen-fish", iconName: "Snowflake", countLabel: "Fresh frozen daily", color: "#3b82f6", sortOrder: 1 },
  { name: "Dried Fish", slug: "dried-fish", iconName: "Sun", countLabel: "Sun dried naturally", color: "#f97316", sortOrder: 2 },
  { name: "Smoked Fish", slug: "smoked-fish", iconName: "Flame", countLabel: "Traditional smoked", color: "#ef4444", sortOrder: 3 },
  { name: "Shrimp & Prawn", slug: "shrimp-prawn", iconName: "Shell", countLabel: "Premium quality", color: "#10b981", sortOrder: 4 },
  { name: "Hilsa / Ilish", slug: "hilsa-ilish", iconName: "Fish", countLabel: "National fish", color: "#F59E0B", sortOrder: 5 },
]

const productsData = [
  { name: "Premium Hilsa Fish (Ilish)", categorySlug: "hilsa-ilish", image: "/images/products/Screen Shot 2024-06-19 at 12.34.56 PM.png", rating: 5, reviewsCount: 1045, weights: ["500g", "1kg", "2kg"], price: 1200, originalPrice: null, badge: "HOT", badgeColor: "#ef4444" },
  { name: "Fresh Frozen Rui Fish", categorySlug: "frozen-fish", image: "/images/products/frozen-rui.jpg", rating: 4.5, reviewsCount: 520, weights: ["500g", "1kg", "2kg"], price: 480, originalPrice: 600, badge: "20% OFF", badgeColor: "#3b82f6" },
  { name: "Dried Shutki Fish Pack", categorySlug: "dried-fish", image: "/images/products/dried-shutki.jpg", rating: 4.5, reviewsCount: 340, weights: ["250g", "500g"], price: 350, originalPrice: null, badge: "Fresh!", badgeColor: "#10b981" },
  { name: "King Prawns (Bagda Chingri)", categorySlug: "shrimp-prawn", image: "/images/products/king-prawns.jpg", rating: 5, reviewsCount: 780, weights: ["500g", "1kg"], price: 950, originalPrice: null, badge: "15% OFF", badgeColor: "#f97316" },
  { name: "Smoked Tilapia Fish", categorySlug: "smoked-fish", image: "/images/products/smoked-tilapia.jpg", rating: 4.5, reviewsCount: 317, weights: ["500g", "1kg"], price: 420, originalPrice: null, badge: "New", badgeColor: "#1B1F6F" },
  { name: "Frozen Catla (Katla) Fish", categorySlug: "frozen-fish", image: "/images/products/frozen-katla.jpg", rating: 5, reviewsCount: 190, weights: ["1kg", "2kg", "5kg"], price: 520, originalPrice: null, badge: "Fresh!", badgeColor: "#10b981" },
  { name: "River Prawn (Golda Chingri)", categorySlug: "shrimp-prawn", image: "/images/products/river-prawn.jpg", rating: 5, reviewsCount: 250, weights: ["250g", "500g", "1kg"], price: 1100, originalPrice: null, badge: "HOT", badgeColor: "#ef4444" },
  { name: "Sun Dried Loitta Fish", categorySlug: "dried-fish", image: "/images/products/dried-loitta.jpg", rating: 4.5, reviewsCount: 145, weights: ["250g", "500g"], price: 280, originalPrice: null, badge: "15% OFF", badgeColor: "#f97316" },
]

const testimonialsData = [
  { name: "Amena Khatun", role: "Loyal Customer", rating: 5, text: "Processe Fish delivers the freshest fish I have ever ordered online. The hilsa was absolutely amazing and the packaging was perfect!", initials: "AK", color: "#1B1F6F", sortOrder: 0 },
  { name: "Sumaiya Ahmed", role: "Chittagong, BD", rating: 5, text: "The dried fish quality is exceptional. I've ordered multiple times and every time the freshness is maintained perfectly. Highly recommended!", initials: "SA", color: "#10b981", sortOrder: 1 },
  { name: "Rahim Uddin", role: "Regular Customer", rating: 5, text: "Best processed fish in Bangladesh. Their packaging keeps everything fresh. The king prawns are my favorite - always perfectly sized!", initials: "RU", color: "#F59E0B", sortOrder: 2 },
]

async function main() {
  console.log("Seeding database...")

  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, iconName: c.iconName, countLabel: c.countLabel, color: c.color, sortOrder: c.sortOrder },
    })
  }

  const categories = await prisma.category.findMany()
  const slugToId = Object.fromEntries(categories.map((x) => [x.slug, x.id]))

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i]
    const categoryId = slugToId[p.categorySlug]
    if (!categoryId) continue
    const slug = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + i
    await prisma.product.upsert({
      where: { slug },
      create: {
        name: p.name,
        slug,
        categoryId,
        image: p.image,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        weights: JSON.stringify(p.weights),
        price: p.price,
        originalPrice: p.originalPrice,
        badge: p.badge,
        badgeColor: p.badgeColor,
        sortOrder: i,
      },
      update: {
        name: p.name,
        categoryId,
        image: p.image,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        weights: JSON.stringify(p.weights),
        price: p.price,
        originalPrice: p.originalPrice,
        badge: p.badge,
        badgeColor: p.badgeColor,
      },
    })
  }

  const existingTestimonials = await prisma.testimonial.count()
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: testimonialsData.map((t, i) => ({
        name: t.name,
        role: t.role,
        rating: t.rating,
        text: t.text,
        initials: t.initials,
        color: t.color,
        sortOrder: t.sortOrder,
        approved: true,
      })),
    })
  }

  console.log("Seed completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
