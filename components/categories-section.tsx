import Link from "next/link"
import { Fish, Snowflake, Sun, Flame, Shell } from "lucide-react"
import type { CategoryData } from "@/lib/data"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Fish,
  Snowflake,
  Sun,
  Flame,
  Shell,
}

const fallbackCategories = [
  { id: "1", name: "All Fish", slug: "all-fish", countLabel: "200+ varieties", color: "#1B1F6F", iconName: "Fish" },
  { id: "2", name: "Frozen Fish", slug: "frozen-fish", countLabel: "Fresh frozen daily", color: "#3b82f6", iconName: "Snowflake" },
  { id: "3", name: "Dried Fish", slug: "dried-fish", countLabel: "Sun dried naturally", color: "#f97316", iconName: "Sun" },
  { id: "4", name: "Smoked Fish", slug: "smoked-fish", countLabel: "Traditional smoked", color: "#ef4444", iconName: "Flame" },
  { id: "5", name: "Shrimp & Prawn", slug: "shrimp-prawn", countLabel: "Premium quality", color: "#10b981", iconName: "Shell" },
  { id: "6", name: "Hilsa / Ilish", slug: "hilsa-ilish", countLabel: "National fish", color: "#F59E0B", iconName: "Fish" },
]

export function CategoriesSection({ categories = [] }: { categories?: CategoryData[] }) {
  const list = categories.length > 0 ? categories : fallbackCategories.map((c) => ({ ...c, sortOrder: 0, productCount: 0 }))

  return (
    <section id="categories" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold" style={{ color: "#1B1F6F" }}>
            Explore Categories
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Shop By <span className="text-accent">Category</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Discover our wide range of processed all Fish products, carefully categorized for your convenience
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {list.map((cat) => {
            const Icon = iconMap[cat.iconName ?? "Fish"] ?? Fish
            const color = cat.color ?? "#1B1F6F"
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="h-7 w-7" style={{ color }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{cat.countLabel ?? cat.productCount + " products"}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
