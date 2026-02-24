'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StatusFormProps {
  orderId: string;
  currentStatus: string;
}

export default function StatusForm({ orderId, currentStatus }: StatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">স্ট্যাটাস পরিবর্তন করুন</h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex-1">
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            নতুন স্ট্যাটাস নির্বাচন করুন
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">অপেক্ষমাণ</option>
            <option value="confirmed">কনফার্মড</option>
            <option value="processing">প্রসেসিং</option>
            <option value="shipped">শিপড</option>
            <option value="delivered">ডেলিভারড</option>
            <option value="cancelled">বাতিল</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}