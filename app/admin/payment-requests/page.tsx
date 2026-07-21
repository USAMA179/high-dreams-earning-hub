"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import AdminGuard from "../components/AdminGuard";

type PaymentRequest = {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  transactionId?: string;
  tillId?: string;
  createdAt?: { toDate?: () => Date } | string | number | null;
  amount?: string;
  paymentMethod?: string;
  status?: string;
};

function formatPaymentDate(value: PaymentRequest["createdAt"]) {
  if (!value) {
    return "Unknown";
  }

  const date = typeof value === "object" && value !== null && "toDate" in value ? value.toDate?.() ?? new Date(0) : new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminPaymentRequestsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadPayments = async () => {
    if (!firestore) {
      setIsLoading(false);
      return;
    }

    const paymentsQuery = query(collection(firestore, "payments"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(paymentsQuery);
    setPayments(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      await loadPayments();
    };

    void fetchPayments();
  }, []);

  const handleStatusUpdate = async (paymentId: string, userId: string | undefined, status: string) => {
    if (!firestore || !userId) {
      return;
    }

    setActionInProgress(paymentId);
    try {
      const paymentRef = doc(firestore, "payments", paymentId);
      const userRef = doc(firestore, "users", userId);
      const paymentUpdates: Record<string, unknown> = {
        status,
        approved: status === "Approved",
      };

      if (status === "Approved") {
        paymentUpdates.approvedAt = serverTimestamp();
      } else {
        paymentUpdates.rejectedAt = serverTimestamp();
      }

      await Promise.all([
        updateDoc(paymentRef, paymentUpdates),
        updateDoc(userRef, { paymentStatus: status }),
      ]);
      await loadPayments();
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <AdminGuard>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Payment Requests</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950">Verify user payments</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Review submitted payment requests, approve verified members, and reject incomplete requests.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">Loading payment requests...</div>
          ) : payments.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm text-slate-600">No payment requests available.</div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700">
                        {payment.status || "pending"}
                      </span>
                      <p className="text-sm text-slate-500">{formatPaymentDate(payment.createdAt)}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">User Name</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.userName || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Email</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.userEmail || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Amount</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.amount || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Payment Method</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.paymentMethod || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-sm rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Payment Details</p>
                    <div className="mt-4 space-y-4 rounded-3xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-950">Transaction ID</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.transactionId || "—"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">Till ID</p>
                        <p className="mt-2 text-sm text-slate-600">{payment.tillId || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(payment.id, payment.userId, "Approved")}
                    disabled={actionInProgress === payment.id}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(payment.id, payment.userId, "Rejected")}
                    disabled={actionInProgress === payment.id}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AdminGuard>
  );
}
