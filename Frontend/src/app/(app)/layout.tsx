/**
 * Layout for authenticated pages (dashboard, groups, expenses, etc.).
 * Currently a placeholder – will be expanded as features are built.
 */

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <main>{children}</main>
    </div>
  );
}