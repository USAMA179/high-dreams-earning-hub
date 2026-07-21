"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { paymentConfig } from "../../lib/paymentConfig";
import { auth, firestore } from "../../lib/firebase";

type PaymentSettings = {
  paymentMethod: string;
  amount: string;
  tillId: string;
};

export default function PaymentVerificationPage() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentMethod: paymentConfig.paymentMethod,
    amount: paymentConfig.amount,
    tillId: paymentConfig.tillId,
  });

  useEffect(() => {
    if (!auth) {
      router.push("/login");
      return;
    }

    let unsubscribeSnapshot: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      unsubscribeSnapshot = onSnapshot(userRef, (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const userData = snapshot.data();
        if (userData.paymentStatus === "Approved") {
          router.push("/dashboard");
        }
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot?.();
    };
  }, [router]);

  useEffect(() => {
    const loadSettings = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const settingsDoc = await getDoc(doc(firestore, "settings", "payment"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setPaymentSettings({
          paymentMethod: data.paymentMethod || paymentConfig.paymentMethod,
          amount: data.amount || paymentConfig.amount,
          tillId: data.tillId || paymentConfig.tillId,
        });
      }

      setIsLoading(false);
    };

    void loadSettings();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transactionId.trim()) {
      setError("Please enter your transaction ID.");
      return;
    }

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (!auth || !firestore) {
        throw new Error("Firebase is not initialized.");
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : { name: "" };

      await addDoc(collection(firestore, "payments"), {
        userId: currentUser.uid,
        userName: userData.name || "",
        userEmail: currentUser.email,
        transactionId: transactionId.trim(),
        paymentMethod: paymentSettings.paymentMethod,
        tillId: paymentSettings.tillId,
        amount: paymentSettings.amount,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setMessage("Your payment verification is pending.");
      setTransactionId("");
    } catch (submitError: unknown) {
      const message = submitError instanceof Error ? submitError.message : "Unable to submit payment verification. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="payment" />
      <main className="mx-auto max-w-5xl px-6 py-24 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-8 shadow-2xl shadow-slate-200/60 sm:p-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 shadow-md">
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Pending Verification</p>
                <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">Account Pending Verification</h1>
                <p className="max-w-xl text-base leading-7 text-slate-600">
                  Complete your payment to unlock all premium earning resources.
                </p>
              </div>

              <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
                  <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/40">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Payment Method</p>
                    <p className="mt-4 text-xl font-semibold text-slate-950">{paymentSettings.paymentMethod}</p>
                  </div>
                  <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/40">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Amount</p>
                    <p className="mt-4 text-xl font-semibold text-slate-950">{paymentSettings.amount}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/40">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Till ID</p>
                    <p className="mt-4 text-xl font-semibold text-slate-950">{paymentSettings.tillId}</p>
                    <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
                      <Image
                        src="/scan.jpeg"
                        alt="Scan QR code"
                        width={500}
                        height={400}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Payment verification</p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Enter your transaction ID to submit your payment request for review.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <label className="block text-sm font-semibold text-slate-900">
                      Transaction ID
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(event) => setTransactionId(event.target.value)}
                        placeholder="Enter your transaction ID"
                        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </label>

                    {error ? <p className="text-sm text-red-600">{error}</p> : null}

                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting..." : isLoading ? "Loading..." : "Submit Payment"}
                    </button>

                    {message ? (
                      <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-800 shadow-sm shadow-emerald-100/70">
                        <p>{message}</p>
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
