
"use client"

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { AppSidebar } from "@/components/layout/sidebar";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemo(() => 
    user ? doc(db, 'users', user.uid) : null, 
    [db, user]
  );

  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user || (profile as any)?.role !== 'admin') {
        router.push("/");
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (profile as any)?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
