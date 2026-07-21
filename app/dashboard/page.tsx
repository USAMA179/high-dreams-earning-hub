"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, firestore } from "../../lib/firebase";
import { getPlatformLogo } from "../../lib/platform";
import { defaultPlatforms } from "../../lib/defaultPlatforms";

type UserProfile = {
  name?: string;
  paymentStatus?: string;
  status?: string;
  approved?: boolean;
};

function normalizeStatus(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isApprovedUserProfile(userProfile: UserProfile | null | undefined): boolean {
  if (!userProfile) {
    return false;
  }

  return (
    normalizeStatus(userProfile.paymentStatus) === "approved" ||
    normalizeStatus(userProfile.status) === "approved" ||
    userProfile.approved === true
  );
}

type Platform = {
  id: string;
  name: string;
  description?: string;
  referralLink?: string;
  status?: string;
};

type PlatformLogoProps = {
  referralLink?: string;
  name: string;
};

function PlatformLogo({ referralLink, name }: PlatformLogoProps) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getPlatformLogo(referralLink || "");

  if (!logoUrl || hasError) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white">
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        fill
        className="object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [platformsLoading, setPlatformsLoading] = useState(false);
  const [platformsError, setPlatformsError] = useState("");

  useEffect(() => {
    if (!auth) {
      router.replace("/login");
      return;
    }

    let unsubscribeSnapshot: (() => void) | undefined;
    let unsubscribePayments: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (!firestore) {
        setIsLoading(false);
        return;
      }

      const userRef = doc(firestore, "users", user.uid);
      unsubscribeSnapshot = onSnapshot(
        userRef,
        (snapshot) => {
          const baseUserData = snapshot.exists()
            ? (snapshot.data() as UserProfile)
            : { name: user.displayName || "", paymentStatus: "pending" };

          setUserProfile(baseUserData);
          setIsLoading(false);
        },
        () => {
          const fallbackData = { name: user.displayName || "", paymentStatus: "pending" };
          setUserProfile(fallbackData);
          setIsLoading(false);
        }
      );

      unsubscribePayments = onSnapshot(
        query(collection(firestore, "payments"), where("userId", "==", user.uid)),
        (paymentsSnapshot) => {
          const approvedPayment = paymentsSnapshot.docs.some((paymentDoc) => {
            const paymentData = paymentDoc.data() as { status?: string; approved?: boolean };
            return (
              normalizeStatus(paymentData.status) === "approved" ||
              paymentData.approved === true
            );
          });
          setPaymentApproved(approvedPayment);
        },
        () => {
          setPaymentApproved(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot?.();
      unsubscribePayments?.();
    };
  }, [router]);

  const isApproved = isApprovedUserProfile(userProfile) || paymentApproved;

  useEffect(() => {
    const loadPlatforms = async () => {
      if (!isApproved || !firestore) {
        return;
      }

      setPlatformsError("");
      setPlatformsLoading(true);

      try {
        const platformsQuery = query(
          collection(firestore, "platforms"),
          where("status", "==", "Active")
        );
        const snapshot = await getDocs(platformsQuery);
        const activePlatforms = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Omit<Platform, "id">),
        }));

        const resolvedPlatforms = activePlatforms.length > 0
          ? activePlatforms
          : defaultPlatforms.map((platform, index) => ({
              id: `default-${index}`,
              ...platform,
            }));

        console.log("Active platforms:", resolvedPlatforms);
        setPlatforms(resolvedPlatforms);
      } catch (error: unknown) {
        setPlatformsError(error instanceof Error ? error.message : "Unable to load platforms.");
      } finally {
        setPlatformsLoading(false);
      }
    };

    void loadPlatforms();
  }, [isApproved]);

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
          {isApproved ? (
            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600">Available Platforms</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Access your earning platform links</h2>
                  <p className="mt-1 text-sm text-slate-600">Showing {platforms.length} verified earning platforms.</p>
                </div>
                <p className="text-sm text-slate-600">Browse all active platforms available to you.</p>
              </div>

              <div className="mt-8 space-y-4">
                {platformsLoading ? (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">Loading platforms...</div>
                ) : platformsError ? (
                  <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-rose-700">{platformsError}</div>
                ) : platforms.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">No active platforms are available at the moment.</div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-4">
                          <PlatformLogo referralLink={platform.referralLink} name={platform.name} />
                          <div>
                            <p className="text-base font-semibold text-slate-950">{platform.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{platform.status || "Active"}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">{platform.description}</p>
                        <div className="mt-6 flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-500">Status: {platform.status || "Active"}</span>
                          <a
                            href={platform.referralLink || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            Open Platform
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
