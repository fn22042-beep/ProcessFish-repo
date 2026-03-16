"use client"

import type { ProductData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

export function ProductsSection({ products = [] }: { products?: ProductData[] }) {
  const { addItem } = useCart()

  const handleAddToCart = (product: ProductData) => {
    const weight = product.weights[0] ?? "1kg"

    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      weight,
      quantity: 1,
      price: product.price,
    })

    toast.success("কার্টে যোগ হয়েছে", {
      description: `${product.name} (${weight}) আপনার কার্টে যোগ হয়েছে।`,
    })
  }

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span
              className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold"
              style={{ color: "#1B1F6F" }}
            >
              Best Sellers
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Featured <span className="text-accent">Products</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Handpicked processed fish, prawns and seafood loved by our regular customers.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {product.badge && (
                  <span
                    className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold"
                    style={{ color: "#1B1F6F" }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-base">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-accent">
                    ৳{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.rating && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81ল-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118ল-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118ল1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span>({product.reviews})</span>
                  </div>
                )}
                <Button
                  className="mt-4 w-full btn-primary text-sm"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}