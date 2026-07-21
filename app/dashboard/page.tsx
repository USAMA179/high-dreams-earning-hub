"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, firestore } from "../../lib/firebase";

type UserProfile = {
  name?: string;
  paymentStatus?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      router.replace("/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      setUserProfile(userDoc.exists() ? (userDoc.data() as UserProfile) : { name: user.displayName || "", paymentStatus: "pending" });
      setIsLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const isApproved = userProfile?.paymentStatus === "Approved";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="payment" />
      <main className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-8 shadow-2xl shadow-slate-200/60 sm:p-12">
          <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">
                {isLoading ? "Loading your dashboard..." : isApproved ? `Welcome, ${userProfile?.name || "Member"}` : "Welcome to your dashboard"}
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {isLoading
                  ? "Fetching your account details."
                  : isApproved
                  ? "Your payment has been verified successfully. You now have full access to all earning platforms."
                  : "Your account is ready once payment is approved. Check back here for your premium earning resources and account activity."}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Verified Access</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{isApproved ? "Active" : "Pending approval"}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Once payment is confirmed, you can access all verified platforms.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Support</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">Priority response</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Our team is ready to help with any verification questions.</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Resources</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">Premium updates</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">Receive new earning opportunities as soon as they are released.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
