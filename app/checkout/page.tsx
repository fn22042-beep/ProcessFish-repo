import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutContent } from "./checkout-content"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <CheckoutContent />
      </main>
      <Footer />
    </div>
  )
}
