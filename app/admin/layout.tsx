// Pass-through layout — login lives here with no sidebar.
// The AdminNav sidebar is scoped to app/admin/(cms)/layout.tsx only.
export const metadata = { title: 'Admin — Portfolio CMS' };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
