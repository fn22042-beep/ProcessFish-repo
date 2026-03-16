import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Award, Truck } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B1F6F 0%, #141752 100%)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 lg:flex-row lg:px-8 lg:py-20">
        {/* Left Content */}
        <div className="relative z-10 flex-1 text-center lg:text-left">
          <div className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold text-accent">
            {"Bangladesh's #1 Processed Fish Brand"}
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Fresh From<br />
            <span className="text-accent">Shop To Home Kitchen</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-blue-200 sm:text-lg">
            We process and deliver the finest quality fish directly from the Bay of Bengal. 
            Hygienically processed, properly packed, and delivered fresh to your doorstep, 
            every single day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Button size="lg" className="bg-accent font-bold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 font-semibold text-white hover:bg-white/10 hover:text-white">
              Our Process
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 lg:justify-start">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "200+", label: "Products" },
              { value: "5★", label: "Average Rating" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-blue-200 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative flex-1">
          <div className="relative mx-auto w-[280px] sm:w-[360px] lg:w-[420px]">
            <Image
              src="/images.jpeg"
              alt="Fresh premium fish from Processed Fish"
              width={420}
              height={420}
              className="rounded-2xl object-cover"
              priority
            />
            {/* Floating Badges */}
            <div className="absolute -left-4 top-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg sm:-left-8">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-xs font-bold" style={{ color: "#1a1a2e" }}>Certified Fresh</p>
                <p className="text-[10px] text-muted-foreground">100% Quality</p>
              </div>
            </div>
            <div className="absolute -right-4 top-1/3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg sm:-right-8">
              <Award className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-bold" style={{ color: "#1a1a2e" }}>Best Quality</p>
                <p className="text-[10px] text-muted-foreground">100% Natural</p>
              </div>
            </div>
            <div className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg sm:-right-6">
              <Truck className="h-5 w-5" style={{ color: "#1B1F6F" }} />
              <div>
                <p className="text-xs font-bold" style={{ color: "#1a1a2e" }}>Fast Delivery</p>
                <p className="text-[10px] text-muted-foreground">Same Day Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}