'use client';

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../../lib/firebase";

type Platform = {
  id: string;
  name: string;
  description: string;
  referralLink: string;
  status: string;
};

export default function PlatformShowcase() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlatforms = async () => {
      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const platformsQuery = query(collection(firestore, "platforms"), orderBy("name", "asc"));
      const snapshot = await getDocs(platformsQuery);
      setPlatforms(snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...(docSnapshot.data() as Omit<Platform, "id">),
      })));
      setIsLoading(false);
    };

    void loadPlatforms();
  }, []);

  return (
    <section id="platforms" className="bg-gradient-to-b from-slate-100 to-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Platform showcase</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Vetted platforms built for earning clarity
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Explore the types of verified earning platforms you get access to after joining High Dreams Earning Hub.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-lg shadow-slate-200/40">
                Loading platforms...
              </div>
            ) : platforms.length === 0 ? (
              <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-lg shadow-slate-200/40">
                No platforms are available right now.
              </div>
            ) : (
              platforms.map((platform) => (
                <div key={platform.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-2xl font-bold text-indigo-600 transition group-hover:bg-indigo-100">
                    {platform.name[0]}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950">{platform.name}</h3>
                  <p className="mt-3 text-sm text-slate-500">{platform.description}</p>
                  <p className="mt-4 text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                    {platform.referralLink}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
