"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", referralCode: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !firestore) {
        return;
      }

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const status = userDoc.data().paymentStatus;
        router.replace(status === "Approved" ? "/dashboard" : "/payment-verification");
      }
    });

    return unsubscribe;
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (!auth || !firestore) {
        throw new Error("Firebase is not initialized.");
      }
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        name: form.fullName,
        email: form.email,
        referralCode: form.referralCode || null,
        role: "user",
        paymentStatus: "pending",
        createdAt: serverTimestamp(),
      });
      router.push("/payment-verification");
    } catch (submitError: unknown) {
      const errorMessage = submitError instanceof Error ? submitError.message : "Unable to create account. Please try again.";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50/90 shadow-2xl shadow-slate-200/60">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-10 sm:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Create your account</p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Start your journey with High Dreams Earning Hub.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Join our premium community and gain access to verified earning platforms, dedicated support, and an easy onboarding experience.
              </p>

              <div className="mt-10 space-y-5 rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200/50">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-3xl bg-indigo-600 text-white grid place-items-center text-lg font-bold">✓</div>
                  <div>
                    <p className="font-semibold text-slate-950">Verified earning platforms</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Access opportunities curated for reliability and transparency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-3xl bg-indigo-600 text-white grid place-items-center text-lg font-bold">⚡</div>
                  <div>
                    <p className="font-semibold text-slate-950">Fast onboarding</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Complete registration and start exploring verified resources quickly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-3xl bg-indigo-600 text-white grid place-items-center text-lg font-bold">⭐</div>
                  <div>
                    <p className="font-semibold text-slate-950">Premium experience</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">A clean, responsive dashboard made to help you stay focused on earning.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 sm:p-12">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Sign up</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">Create account</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter your details below to unlock the High Dreams experience.
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-slate-900">
                  Full Name
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your full name"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  Email Address
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@example.com"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-900">
                  Password
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Create a password"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <p className="text-sm text-slate-500">Minimum 6 characters.</p>

                <label className="block text-sm font-semibold text-slate-900">
                  Referral Code <span className="font-normal text-slate-500">(Optional)</span>
                  <input
                    name="referralCode"
                    value={form.referralCode}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter referral code"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <p className="text-sm text-slate-500">
                  Have a referral code? Enter it to receive referral benefits. Otherwise leave it blank.
                </p>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
