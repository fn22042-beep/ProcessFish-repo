import { ShieldCheck, Truck, RotateCcw, CreditCard, Headphones } from "lucide-react"

const badges = [
  { icon: ShieldCheck, label: "100% Fresh Guaranteed" },
  { icon: Truck, label: "Free Delivery 1500+" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: CreditCard, label: "Secure Payment" },
  { icon: Headphones, label: "24/7 Customer Support" },
]

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-background py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 lg:px-8">
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
            <badge.icon className="h-4 w-4" />
            <span className="text-xs font-medium sm:text-sm">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
