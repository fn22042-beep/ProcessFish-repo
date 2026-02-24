import { Truck } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="bg-accent py-2 px-4 text-center text-sm font-medium" style={{ color: "#1a1a2e" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        <span>
          <strong>FREE DELIVERY</strong> on orders above 1500 | Fresh catch everyday! Use code:{" "}
          <strong className="rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">FRESH20</strong> for 20% OFF
        </span>
      </div>
    </div>
  )
}
