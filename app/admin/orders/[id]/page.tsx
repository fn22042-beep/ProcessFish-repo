import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StatusForm from './StatusForm';
import { CheckCircle, Clock } from 'lucide-react';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const isConfirmed = order.status === 'confirmed' || order.status === 'delivered';

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">অর্ডার #{order.orderNumber}</h1>

      {/* গ্রাহক ও অর্ডার তথ্য */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">গ্রাহকের তথ্য</h2>
            <div className="space-y-1 text-gray-700">
              <p><span className="font-medium">নাম:</span> {order.customerName}</p>
              <p><span className="font-medium">ইমেইল:</span> {order.email}</p>
              <p><span className="font-medium">ফোন:</span> {order.phone}</p>
              <p><span className="font-medium">ঠিকানা:</span> {order.address}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">অর্ডারের তথ্য</h2>
            <div className="space-y-1 text-gray-700">
              <p><span className="font-medium">মোট মূল্য:</span> ৳{order.total.toFixed(2)}</p>
              <p><span className="font-medium">বর্তমান স্ট্যাটাস:</span> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {order.status === 'pending' && 'অপেক্ষমাণ'}
                  {order.status === 'confirmed' && 'কনফার্মড'}
                  {order.status === 'processing' && 'প্রসেসিং'}
                  {order.status === 'shipped' && 'শিপড'}
                  {order.status === 'delivered' && 'ডেলিভারড'}
                  {order.status === 'cancelled' && 'বাতিল'}
                </span>
              </p>
              <p><span className="font-medium">তারিখ:</span> {new Date(order.createdAt).toLocaleString('bn-BD')}</p>
              {order.notes && <p><span className="font-medium">নোট:</span> {order.notes}</p>}
            </div>
          </div>
        </div>

        {/* অর্ডার আইটেম টেবিল */}
        <div>
          <h2 className="text-lg font-semibold mb-3">অর্ডার আইটেমসমূহ</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">প্রোডাক্ট</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ওজন</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">পরিমাণ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">দাম</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">মোট</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.product?.name || 'প্রোডাক্ট নেই'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.weight}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">৳{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">৳{(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isConfirmed ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          কনফার্মড
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          অপেক্ষমাণ
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* স্ট্যাটাস পরিবর্তন ফর্ম - এখন টেবিলের নিচে */}
        <StatusForm orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}