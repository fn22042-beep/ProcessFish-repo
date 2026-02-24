import { Fish, Search, Scissors, Package, Truck, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Fish,
    step: 1,
    title: "Fresh Catch",
    desc: "Our trusted fishermen catch fresh fish daily from the Bay of Bengal using sustainable methods.",
    color: "#1B1F6F",
  },
  {
    icon: Search,
    step: 2,
    title: "Quality Check",
    desc: "Every fish goes through rigorous quality inspections to meet food safety standards.",
    color: "#3b82f6",
  },
  {
    icon: Scissors,
    step: 3,
    title: "Cleaning & Processing",
    desc: "Fish are cleaned, gutted, and processed in our state-of-the-art hygiene facility.",
    color: "#10b981",
  },
  {
    icon: Package,
    step: 4,
    title: "Vacuum Packing",
    desc: "Products are vacuum-sealed to maintain freshness and extend shelf life.",
    color: "#F59E0B",
  },
  {
    icon: Truck,
    step: 5,
    title: "Fast Delivery",
    desc: "Cold chain delivery ensures your fish arrives fresh at your doorstep.",
    color: "#ef4444",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold" style={{ color: "#1B1F6F" }}>
            How We Work
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Our <span className="text-accent">Quality</span> Process
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
            From ocean to your table, every step is carefully monitored to ensure the highest quality and freshness
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-4">
          {steps.map((step, i) => (
            <div key={step.step} className="flex items-center">
              <div className="flex w-40 flex-col items-center text-center sm:w-48">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="h-7 w-7" style={{ color: step.color }} />
                </div>
                <span
                  className="mt-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.step}
                </span>
                <h3 className="mt-2 text-sm font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-1 hidden h-4 w-4 text-muted-foreground sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
