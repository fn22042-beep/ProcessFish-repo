// app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">অর্ডারসমূহ</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">অর্ডার নং</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">গ্রাহক</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোট মূল্য</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">বিস্তারিত</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">{order.orderNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">৳{order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('bn-BD')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                    দেখুন
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}