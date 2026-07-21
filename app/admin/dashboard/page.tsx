"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import AdminGuard from "../components/AdminGuard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPayments: 0,
    approvedUsers: 0,
    referralLinks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      try {
        const [usersSnap, pendingSnap, approvedSnap, referralSnap] = await Promise.all([
          getDocs(collection(firestore, "users")),
          getDocs(query(collection(firestore, "payments"), where("status", "==", "pending"))),
          getDocs(query(collection(firestore, "users"), where("paymentStatus", "==", "Approved"))),
          getDocs(collection(firestore, "referralLinks")),
        ]);

        setStats({
          totalUsers: usersSnap.size,
          pendingPayments: pendingSnap.size,
          approvedUsers: approvedSnap.size,
          referralLinks: referralSnap.size,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      description: "Registered members who joined via the platform.",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      description: "Accounts waiting for payment verification.",
    },
    {
      label: "Approved Users",
      value: stats.approvedUsers,
      description: "Users who have completed payment verification.",
    },
    {
      label: "Referral Links",
      value: stats.referralLinks,
      description: "Active referral entries stored in Firestore.",
    },
  ];

  return (
    <AdminGuard>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Dashboard</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">Admin overview</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor members, review payments, and manage platform settings in one premium control panel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">{card.label}</p>
              <p className="mt-5 text-4xl font-semibold text-slate-950">{isLoading ? "…" : card.value}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Management</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Payment request summary</h2>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Use the payment requests section to review screenshots and approve user accounts.
            </p>
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
