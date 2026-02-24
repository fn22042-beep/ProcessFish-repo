import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/data"
import { ProductsSection } from "@/components/products-section"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await getProducts(category ? { categorySlug: category } : {})

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductsSection products={products} />
      </main>
      <Footer />
    </div>
  )
}
