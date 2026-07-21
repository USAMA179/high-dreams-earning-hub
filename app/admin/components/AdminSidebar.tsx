"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Payment Requests", href: "/admin/payment-requests" },
  { label: "Platforms", href: "/admin/platforms" },
  { label: "Payment Settings", href: "/admin/payment-settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push("/admin/login");
  };

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200/30">
            HD
          </div>
          <div>
            <p className="text-base font-semibold text-slate-950">Admin Panel</p>
            <p className="text-sm text-slate-500">High Dreams Earning Hub</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-100 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
