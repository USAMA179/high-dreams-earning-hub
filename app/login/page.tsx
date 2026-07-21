'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!auth || !firestore) {
        throw new Error("Firebase is not initialized.");
      }
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(firestore, "users", uid));
      const nextRoute = userDoc.exists() && userDoc.data().paymentStatus !== "pending" ? "/dashboard" : "/payment-verification";
      router.push(nextRoute);
    } catch (loginError: unknown) {
      const errorMessage = loginError instanceof Error ? loginError.message : "Unable to sign in. Please check your credentials.";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-24">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-8 shadow-2xl shadow-slate-200/60 sm:p-12">
          <div className="mx-auto max-w-xl space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Welcome back</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Sign in to your account
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Enter your email and password to continue to High Dreams Earning Hub.
              </p>
            </div>

            <form className="space-y-6 bg-white p-6 rounded-[1.75rem] border border-slate-200 shadow-sm shadow-slate-200/50" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-900">
                Email Address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
              <p className="text-center text-sm text-slate-600">
                <a href="#" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
                  Forgot Password?
                </a>
              </p>
              <p className="text-center text-sm text-slate-600">
                Don’t have an account?{' '}
                <Link href="/signup" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
