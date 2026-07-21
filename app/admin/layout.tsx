import type { Metadata } from "next";
import AdminLayoutShell from "./components/AdminLayoutShell";

export const metadata: Metadata = {
  title: "Admin Panel | High Dreams Earning Hub",
  description: "Admin panel for High Dreams Earning Hub",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
