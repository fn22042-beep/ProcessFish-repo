// app/admin/page.tsx
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count();
  const totalProducts = await prisma.product.count();
  const totalContacts = await prisma.contact.count();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">ড্যাশবোর্ড</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">মোট অর্ডার</h2>
          <p className="text-3xl">{totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">মোট প্রোডাক্ট</h2>
          <p className="text-3xl">{totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">কন্টাক্ট ফর্ম</h2>
          <p className="text-3xl">{totalContacts}</p>
        </div>
      </div>
    </div>
  );
}