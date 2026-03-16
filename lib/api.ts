// lib/api.ts
const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  category?: { name: string };
  price: number;
  stock: number;
  description?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Dashboard data aggregation
export async function getDashboardData() {
  // Fetch orders
  const orders = await fetchApi<Order[]>('/orders');
  const products = await fetchApi<Product[]>('/products');

  const today = new Date().toDateString();
  const ordersToday = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const totalOrdersToday = ordersToday.length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalSalesMonthly = monthlyOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingDeliveries = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;
  const totalCustomers = uniqueCustomers;

  // Last 7 days sales
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const salesOverview = last7Days.map(day => {
    const dayOrders = orders.filter(o => o.createdAt.startsWith(day));
    const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return { day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }), sales };
  });

  // Low stock products (stock <= 10)
  const lowStockProducts = products.filter(p => p.stock <= 10).slice(0, 3);

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5).map(o => ({
    ...o,
    itemCount: o.items?.length || 0
  }));

  return {
    totalOrdersToday,
    totalSalesMonthly,
    pendingDeliveries,
    totalCustomers,
    salesOverview,
    lowStockProducts,
    recentOrders
  };
}

export async function getProducts() {
  return fetchApi<Product[]>('/products');
}

export async function getProduct(id: string) {
  return fetchApi<Product>(`/products/${id}`);
}

export async function createProduct(data: Partial<Product>) {
  return fetchApi<Product>('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return fetchApi<Product>(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function deleteProduct(id: string) {
  return fetchApi(`/products/${id}`, { method: 'DELETE' });
}

export async function getOrders() {
  return fetchApi<Order[]>('/orders');
}

export async function getOrder(id: string) {
  return fetchApi<Order>(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return fetchApi<Order>(`/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
}

export async function getCategories() {
  return fetchApi<Category[]>('/categories');
}