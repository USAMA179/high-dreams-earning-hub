"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import AdminGuard from "../components/AdminGuard";

export default function AdminPaymentSettingsPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tillId, setTillId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const docRef = doc(collection(firestore, "settings"), "payment");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPaymentMethod(data.paymentMethod || "JazzCash / Easypaisa");
        setTillId(data.tillId || "XXXXXXXXXXX");
        setAmount(data.amount || "$19.99 USD");
      } else {
        setPaymentMethod("JazzCash / Easypaisa");
        setTillId("XXXXXXXXXXX");
        setAmount("$19.99 USD");
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    try {
      if (!firestore) {
        throw new Error("Firebase is not initialized.");
      }

      const docRef = doc(collection(firestore, "settings"), "payment");
      await setDoc(docRef, {
        paymentMethod,
        tillId,
        amount,
      });
      setMessage("Payment settings were saved successfully.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to save payment settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInput = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  return (
    <AdminGuard>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Payment Settings</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950">Edit payment details</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Update the payment method and account details that appear on the verification page.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-900">
                Payment Method
                <input
                  value={paymentMethod}
                  onChange={handleInput(setPaymentMethod)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Till ID
                <input
                  value={tillId}
                  onChange={handleInput(setTillId)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-900">
                Amount
                <input
                  value={amount}
                  onChange={handleInput(setAmount)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Payment Settings"}
            </button>
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </form>
        </div>
      </section>
    </AdminGuard>
  );
}
