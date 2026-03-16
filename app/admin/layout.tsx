import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  MapPin, 
  CreditCard, 
  BarChart3, 
  Settings,
  Search,
  Bell
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
  { href: '/admin/products', icon: <Package className="h-5 w-5" />, label: 'Products' },
  { href: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" />, label: 'Orders' },
  { href: '/admin/customers', icon: <Users className="h-5 w-5" />, label: 'Customers' },
  { href: '/admin/delivery', icon: <Truck className="h-5 w-5" />, label: 'Delivery' },
  { href: '/admin/live-tracking', icon: <MapPin className="h-5 w-5" />, label: 'Live Tracking' },
  { href: '/admin/payments', icon: <CreditCard className="h-5 w-5" />, label: 'Payments' },
  { href: '/admin/reports', icon: <BarChart3 className="h-5 w-5" />, label: 'Reports' },
  { href: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">FishFresh</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@fishfresh.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, products, customers..."
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}