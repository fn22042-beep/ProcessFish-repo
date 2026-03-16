'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Payment {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: string;
  transactionId?: string;
  order: {
    orderNumber: string;
    customerName: string;
    total: number;
  };
}

interface PaymentData {
  payments: Payment[];
  summary: {
    totalRevenue: number;
    codRevenue: number;
    onlineRevenue: number;
    pendingRefunds: number;
  };
}

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const response = await fetch('/api/admin/payments');
      if (!response.ok) throw new Error('Failed to fetch');
      const paymentData = await response.json();
      setData(paymentData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load payments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-gray-500">Track payments and transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.summary.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{data?.payments.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cash on Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.summary.codRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{data?.payments.filter(p => p.method === 'COD').length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Online Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.summary.onlineRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{data?.payments.filter(p => p.method === 'Online').length} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.summary.pendingRefunds.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{data?.payments.filter(p => p.status === 'refund_pending').length} orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.transactionId || payment.id.slice(-8)}</TableCell>
                  <TableCell>{payment.order.orderNumber}</TableCell>
                  <TableCell>{payment.order.customerName}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}