import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Truck, Users } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  // সমস্ত অর্ডার ও প্রোডাক্ট ডাটা লোড
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  const products = await prisma.product.findMany();

  // আজকের অর্ডার
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter(
    (order) => new Date(order.createdAt) >= todayStart
  );

  // চলতি মাসের অর্ডার ও সেলস
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  const totalSalesMonthly = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

  // পেন্ডিং ডেলিভারি
  const pendingDeliveries = orders.filter(
    (order) => order.status === 'pending' || order.status === 'processing'
  ).length;

  // ইউনিক কাস্টমার সংখ্যা
  const uniqueCustomers = new Set(orders.map((order) => order.email)).size;

  // গত ৭ দিনের সেলস ডাটা (অ্যারে তৈরি)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }).reverse();

  // সমাধান: startsWith এর পরিবর্তে ISO String দিয়ে তুলনা করা হয়েছে
  const salesOverview = last7Days.map((day) => {
    const dayOrders = orders.filter((order) => {
        // Prisma Date Object কে String এ রূপান্তর করে চেক করা হচ্ছে
        const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDateStr === day;
    });
    
    const totalSales = dayOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: totalSales,
    };
  });

  // কম স্টক প্রোডাক্ট (স্টক ≤ ১০) - টাইপ সেফটি যোগ করা হয়েছে
  const lowStockProducts = products
    .filter((product) => (Number(product.stock) || 0) <= 10)
    .slice(0, 3);

  // সাম্প্রতিক ৫টি অর্ডার
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* স্ট্যাটস কার্ড */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders (Today)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersToday.length}</div>
            <p className="text-xs text-green-600">Real-time update</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales (Monthly)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSalesMonthly.toFixed(2)}</div>
            <p className="text-xs text-green-600">Current month target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeliveries}</div>
            <p className="text-xs text-yellow-600">Active shipments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-green-600">Based on unique emails</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview - Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200">
            {salesOverview.length > 0 ? (
              <div className="grid grid-cols-7 gap-4 text-center">
                {salesOverview.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 border-r last:border-0 border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{item.day}</span>
                    <span className="text-sm md:text-lg font-bold text-blue-600">${item.sales.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500">No data found</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Low Stock Alert */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="overflow-hidden">
                    <p className="font-medium truncate text-sm">{product.name}</p>
                    <p className="text-xs text-red-500 font-semibold">Stock: {product.stock ?? 0}</p>
                  </div>
                  <Badge variant="destructive" className="text-[10px] h-5">Critical</Badge>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-gray-400 italic">Inventory is healthy</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="text-blue-600">View All →</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-[10px] text-slate-500">#{order.id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="text-sm font-medium truncate max-w-[150px]">
                      {order.customerName || order.email.split('@')[0]}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={order.status === 'delivered' ? 'default' : 'outline'}
                        className={`capitalize text-[10px] ${order.status === 'pending' ? 'border-red-200 text-red-600 bg-red-50' : ''}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}