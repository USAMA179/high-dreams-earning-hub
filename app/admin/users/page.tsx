"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import AdminGuard from "../components/AdminGuard";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  paymentStatus: string;
  createdAt: unknown;
};

function formatTimestamp(value: unknown) {
  if (!value) {
    return "Unknown";
  }

  const date = typeof value === "object" && value !== null && "toDate" in value ? (value as { toDate: () => Date }).toDate() : new Date(value as string);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const usersQuery = query(collection(firestore, "users"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(usersQuery);
      setUsers(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "—",
            email: data.email || "—",
            paymentStatus: data.paymentStatus || "pending",
            createdAt: data.createdAt || null,
          };
        })
      );
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  return (
    <AdminGuard>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Users</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950">Registered members</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                View all registered users and track their registration date and payment status in a clean, responsive layout.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-[0.3em]">Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-[0.3em]">Email</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-[0.3em]">Registration Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-[0.3em]">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No registered users yet.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5 text-slate-950">{user.name}</td>
                      <td className="px-6 py-5 text-slate-600">{user.email}</td>
                      <td className="px-6 py-5 text-slate-600">{formatTimestamp(user.createdAt)}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.paymentStatus === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : user.paymentStatus === "Rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {user.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
