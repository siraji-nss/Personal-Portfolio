import AdminNav from '../AdminNav';

// This layout applies to all /admin/* routes EXCEPT /admin/login.
// Auth is enforced by middleware.ts — no redirect needed here.
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] flex">
      <AdminNav />
      <main className="flex-1 ml-56 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
