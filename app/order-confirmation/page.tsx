import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: searchParams.id },
    include: { items: { include: { product: true } }, payments: true },
  });

  if (!order) return notFound();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">অর্ডার সফল হয়েছে!</h1>
      <p className="text-xl mb-2">অর্ডার নম্বর: #{order.orderNumber}</p>
      <p className="mb-8">
        আপনার অর্ডারটি {order.payments?.[0]?.method === "cod" ? "ক্যাশ অন ডেলিভারি" : "কার্ড পেমেন্ট"} এর মাধ্যমে সম্পন্ন হয়েছে।
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary/90"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}