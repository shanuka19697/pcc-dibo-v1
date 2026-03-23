export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 overflow-auto">
      {children}
    </div>
  );
}
