"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

const ADMIN_EMAIL = "dreamearning@admin.com";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.replace("/admin/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        if (user && auth) {
          await signOut(auth);
        }
        router.replace("/admin/login");
        setIsChecking(false);
        return;
      }

      setAuthorized(true);
      setIsChecking(false);
    });

    return unsubscribe;
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="h-16 w-16 animate-pulse rounded-full bg-slate-200"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
