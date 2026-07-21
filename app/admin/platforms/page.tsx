"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../lib/firebase";
import AdminGuard from "../components/AdminGuard";

type PlatformRecord = {
  id: string;
  name: string;
  description: string;
  referralLink: string;
  status: string;
};

export default function AdminPlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformRecord[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadPlatforms = async () => {
    if (!firestore) {
      setIsLoading(false);
      return;
    }

    const platformsQuery = query(collection(firestore, "platforms"), orderBy("name", "asc"));
    const snapshot = await getDocs(platformsQuery);
    setPlatforms(
      snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<PlatformRecord, "id">),
      }))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchPlatforms = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const platformsQuery = query(collection(firestore, "platforms"), orderBy("name", "asc"));
      const snapshot = await getDocs(platformsQuery);
      setPlatforms(
        snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<PlatformRecord, "id">),
        }))
      );
      setIsLoading(false);
    };

    void fetchPlatforms();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setReferralLink("");
    setStatus("Active");
    setSelectedPlatform(null);
  };

  const handleEdit = (platform: PlatformRecord) => {
    setSelectedPlatform(platform);
    setName(platform.name);
    setDescription(platform.description);
    setReferralLink(platform.referralLink);
    setStatus(platform.status);
    setMessage("");
  };

  const handleDelete = async (platformId: string) => {
    if (!firestore) {
      return;
    }
    await deleteDoc(doc(firestore, "platforms", platformId));
    await loadPlatforms();
    if (selectedPlatform?.id === platformId) {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (!firestore) {
        throw new Error("Firebase is not initialized.");
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        referralLink: referralLink.trim(),
        status,
        updatedAt: serverTimestamp(),
      };

      if (!payload.name || !payload.description || !payload.referralLink) {
        throw new Error("Please fill in all platform fields.");
      }

      if (selectedPlatform) {
        const platformRef = doc(firestore, "platforms", selectedPlatform.id);
        await updateDoc(platformRef, payload);
        setMessage("Platform updated successfully.");
      } else {
        await addDoc(collection(firestore, "platforms"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setMessage("Platform added successfully.");
      }

      resetForm();
      await loadPlatforms();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Unable to save platform.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminGuard>
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Platform Management</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950">Manage platforms</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Add, edit, and remove referral platforms displayed on the homepage.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Platform list</p>
                <p className="mt-2 text-sm text-slate-600">Manage the platforms that appear across the main website.</p>
              </div>
            </div>
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading platforms...</p>
            ) : platforms.length === 0 ? (
              <p className="text-sm text-slate-500">No platforms added yet.</p>
            ) : (
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{platform.name}</p>
                        <p className="mt-2 text-sm text-slate-600">{platform.description}</p>
                        <p className="mt-2 text-sm text-slate-500">{platform.referralLink}</p>
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          platform.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                        }`}>
                          {platform.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(platform)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(platform.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">{selectedPlatform ? "Edit Platform" : "Add Platform"}</p>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-900">
                Platform Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-3 h-28 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Referral Link
                <input
                  value={referralLink}
                  onChange={(event) => setReferralLink(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : selectedPlatform ? "Update Platform" : "Add Platform"}
                </button>
                {selectedPlatform ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
              {message ? <p className="text-sm text-slate-600">{message}</p> : null}
            </form>
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
