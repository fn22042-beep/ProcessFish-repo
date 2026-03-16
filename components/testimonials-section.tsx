import { Star, Quote } from "lucide-react"
import type { TestimonialData } from "@/lib/data"

const fallbackTestimonials: TestimonialData[] = [
  { id: "1", name: "Amena Khatun", role: "Loyal Customer", rating: 5, text: "Processe Fish delivers the freshest fish I have ever ordered online. The hilsa was absolutely amazing and the packaging was perfect!", initials: "AK", color: "#1B1F6F", sortOrder: 0 },
  { id: "2", name: "Sumaiya Ahmed", role: "Chittagong, BD", rating: 5, text: "The dried fish quality is exceptional. I've ordered multiple times and every time the freshness is maintained perfectly. Highly recommended!", initials: "SA", color: "#10b981", sortOrder: 1 },
  { id: "3", name: "Rahim Uddin", role: "Regular Customer", rating: 5, text: "Best processed fish in Bangladesh. Their packaging keeps everything fresh. The king prawns are my favorite - always perfectly sized!", initials: "RU", color: "#F59E0B", sortOrder: 2 },
]

export function TestimonialsSection({ testimonials = [] }: { testimonials?: TestimonialData[] }) {
  const list = testimonials.length > 0 ? testimonials : fallbackTestimonials

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold" style={{ color: "#1B1F6F" }}>
            Reviews
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            What Our <span className="text-accent">Customers</span> Say
          </h2>
          <p className="mt-3 text-muted-foreground">
            {"Don't"} just take our word for it. {"Here's"} what our happy customers think about Processe Fish.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {list.map((t) => (
            <div
              key={t.id}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-muted/50" />

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.text}</p>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: t.color || "#1B1F6F" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
