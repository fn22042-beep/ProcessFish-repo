import { AnnouncementBar } from "@/components/announcement-bar"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrustBadges } from "@/components/trust-badges"
import { CategoriesSection } from "@/components/categories-section"
import { ProductsSection } from "@/components/products-section"
import { PromoSection } from "@/components/promo-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { getProducts, getCategories, getTestimonials } from "@/lib/data"

export default async function Home() {
  const [products, categories, testimonials] = await Promise.all([
    getProducts(),
    getCategories(),
    getTestimonials(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <CategoriesSection categories={categories} />
        <ProductsSection products={products} />
        <PromoSection />
        <ProcessSection />
        <TestimonialsSection testimonials={testimonials} />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
