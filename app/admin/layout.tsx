// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/admin" className="font-bold">ড্যাশবোর্ড</a>
          <a href="/admin/orders">অর্ডারসমূহ</a>
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}