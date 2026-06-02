import AdminNav from '../AdminNav';

// This layout applies to all /admin/* routes EXCEPT /admin/login.
// Auth is enforced by middleware.ts — no redirect needed here.
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <AdminNav />
      {/* Desktop: offset for fixed sidebar; Mobile: offset for fixed top bar */}
      <main className="lg:ml-56 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
