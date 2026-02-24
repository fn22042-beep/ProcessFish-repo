import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrderDetail } from "./order-detail"

type Props = { params: Promise<{ orderNumber: string }> }

export default async function OrderStatusPage({ params }: Props) {
  const { orderNumber } = await params
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <OrderDetail orderNumber={orderNumber} />
      </main>
      <Footer />
    </div>
  )
}
