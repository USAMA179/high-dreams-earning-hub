'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";

type HeaderProps = {
  variant?: "default" | "payment";
};

export default function Header({ variant = "default" }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isPayment = variant === "payment";

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    if (!auth) {
      window.location.href = "/login";
      return;
    }
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-200/50">
            HD
          </div>
          <div>
            <Link href="/" className="text-base font-semibold tracking-tight text-slate-950">
              High Dreams
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Earning Hub</p>
          </div>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-slate-900">
            Why Us
          </a>
          <a href="#testimonials" className="transition hover:text-slate-900">
            Testimonials
          </a>
          <a href="#pricing" className="transition hover:text-slate-900">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          {isPayment ? (
            <>
              <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="rounded-full bg-slate-950 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800">
                Logout
              </button>
            </>
          ) : currentUser ? (
            <Link href="/dashboard" className="rounded-full bg-slate-950 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Sign In
              </Link>
              <Link href="/signup" className="rounded-full bg-slate-950 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
