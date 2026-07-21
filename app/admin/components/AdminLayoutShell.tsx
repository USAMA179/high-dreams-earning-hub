"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const hideSidebar = pathname === "/admin" || pathname.startsWith("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {hideSidebar ? (
          <div className="flex-1">{children}</div>
        ) : (
          <div className="grid min-h-[calc(100vh-3rem)] w-full gap-6 xl:grid-cols-[300px_1fr]">
            <AdminSidebar />
            <main className="space-y-6">{children}</main>
          </div>
        )}
      </div>
    </div>
  );
}
