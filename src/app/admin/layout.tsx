
"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If no user is logged in or user is not an admin, redirect to login
    if (!currentUser || currentUser.role !== 'Admin') {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUser.role !== 'Admin') {
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
