"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { ProductData } from "@/lib/data"
import { toast } from "sonner"

const tabs = ["All Products", "Most Popular", "New Arrivals", "On Sale", "Premium"]

// Fallback static products when DB has no data
const fallbackProducts: ProductData[] = [
  { id: "1", name: "Premium Hilsa Fish (Ilish)", category: "HILSA & ILISH", categoryId: "", image: "/images/products/Screen Shot 2024-06-19 at 12.34.56 PM.png", images: [], rating: 5, reviews: 1045, weights: ["500g", "1kg", "2kg"], price: 1200, badge: "HOT", badgeColor: "#ef4444", isFeatured: false, isOnSale: false },
  { id: "2", name: "Fresh Frozen Rui Fish", category: "FROZEN FISH", categoryId: "", image: "/images/products/frozen-rui.jpg", images: [], rating: 4.5, reviews: 520, weights: ["500g", "1kg", "2kg"], price: 480, originalPrice: 600, badge: "20% OFF", badgeColor: "#3b82f6", isFeatured: false, isOnSale: true },
  { id: "3", name: "Dried Shutki Fish Pack", category: "DRIED FISH", categoryId: "", image: "/images/products/dried-shutki.jpg", images: [], rating: 4.5, reviews: 340, weights: ["250g", "500g"], price: 350, badge: "Fresh!", badgeColor: "#10b981", isFeatured: false, isOnSale: false },
  { id: "4", name: "King Prawns (Bagda Chingri)", category: "SHRIMP & PRAWN", categoryId: "", image: "/images/products/king-prawns.jpg", images: [], rating: 5, reviews: 780, weights: ["500g", "1kg"], price: 950, badge: "15% OFF", badgeColor: "#f97316", isFeatured: false, isOnSale: false },
  { id: "5", name: "Smoked Tilapia Fish", category: "SMOKED FISH", categoryId: "", image: "/images/products/smoked-tilapia.jpg", images: [], rating: 4.5, reviews: 317, weights: ["500g", "1kg"], price: 420, badge: "New", badgeColor: "#1B1F6F", isFeatured: false, isOnSale: false },
  { id: "6", name: "Frozen Catla (Katla) Fish", category: "FROZEN FISH", categoryId: "", image: "/images/products/frozen-katla.jpg", images: [], rating: 5, reviews: 190, weights: ["1kg", "2kg", "5kg"], price: 520, badge: "Fresh!", badgeColor: "#10b981", isFeatured: false, isOnSale: false },
  { id: "7", name: "River Prawn (Golda Chingri)", category: "SHRIMP & PRAWN", categoryId: "", image: "/images/products/river-prawn.jpg", images: [], rating: 5, reviews: 250, weights: ["250g", "500g", "1kg"], price: 1100, badge: "HOT", badgeColor: "#ef4444", isFeatured: false, isOnSale: false },
  { id: "8", name: "Sun Dried Loitta Fish", category: "DRIED FISH", categoryId: "", image: "/images/products/dried-loitta.jpg", images: [], rating: 4.5, reviews: 145, weights: ["250g", "500g"], price: 280, badge: "15% OFF", badgeColor: "#f97316", isFeatured: false, isOnSale: false },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating) ? "fill-accent text-accent" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: ProductData }) {
  const [selectedWeight, setSelectedWeight] = useState(0)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    const weight = product.weights[selectedWeight]
    if (!weight) return
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      weight,
      quantity: 1,
      price: product.price,
    })
    toast.success(`${product.name} (${weight}) added to cart`)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Badge */}
      {product.badge && (
        <span
          className="absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: product.badgeColor }}
        >
          {product.badge}
        </span>
      )}

      {/* Wishlist */}
      <button
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-muted-foreground opacity-0 shadow transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label={`Add ${product.name} to wishlist`}
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Image */}
      <div className="flex h-44 items-center justify-center bg-muted p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={160}
          height={160}
          className="h-36 w-36 rounded-lg object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 text-sm font-bold leading-tight text-foreground">{product.name}</h3>

        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Weight Options */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.weights.map((w, i) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(i)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                i === selectedWeight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Price & Add */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold" style={{ color: "#1B1F6F" }}>
              {"৳"}{product.price}
            </span>
            {product.originalPrice && (
              <span className="ml-1.5 text-xs text-muted-foreground line-through">
                {"৳"}{product.originalPrice}
              </span>
            )}
          </div>
          <Button size="sm" className="h-8 gap-1 bg-accent text-xs font-semibold hover:bg-amber-400" style={{ color: "#1B1F6F" }} onClick={handleAddToCart}>
            <ShoppingCart className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ProductsSection({ products = [] }: { products?: ProductData[] }) {
  const [activeTab, setActiveTab] = useState("All Products")
  const list = products.length > 0 ? products : fallbackProducts

  return (
    <section id="products" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold" style={{ color: "#1B1F6F" }}>
            Our Products
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Fresh <span className="text-accent">Seafood</span> Collection
          </h2>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === activeTab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
