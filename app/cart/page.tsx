import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartContent } from "./cart-content"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <CartContent />
      </main>
      <Footer />
    </div>
  )
}
