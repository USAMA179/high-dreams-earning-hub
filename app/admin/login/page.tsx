"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";

const ADMIN_EMAIL = "dreamearning@admin.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === ADMIN_EMAIL) {
        router.replace("/admin/dashboard");
      }
    });

    return unsubscribe;
  }, [router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (form.email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Unauthorized Admin Account");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!auth) {
        throw new Error("Firebase is not initialized.");
      }

      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      if (userCredential.user.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized Admin Account");
      }

      router.push("/admin/dashboard");
    } catch (loginError: unknown) {
      const errorMessage =
        loginError instanceof Error ? loginError.message : String(loginError);
      const message =
        errorMessage === "Firebase: Error (auth/wrong-password)."
          ? "Incorrect password."
          : errorMessage === "Firebase: Error (auth/user-not-found)."
          ? "Admin account not found."
          : errorMessage === "Unauthorized Admin Account"
          ? "Unauthorized Admin Account"
          : "Unable to sign in. Please check your credentials.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/60 sm:p-12">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-2xl font-black text-white shadow-lg shadow-indigo-200/40">
              A
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Admin Access</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Admin Login</h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600">
              Use the dedicated admin credentials to access the High Dreams Earning Hub dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-900">
              Email Address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
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
                placeholder="Enter admin password"
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
              <Link href="/" className="font-semibold text-indigo-600 transition hover:text-indigo-700">
                Return to website
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
