
"use client"

import { 
  LayoutDashboard, 
  Users, 
  History, 
  FileBarChart, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Library
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Visit Logs", href: "/admin/history", icon: History },
  { name: "AI Insights", href: "/admin/reports", icon: FileBarChart },
];

const VISITOR_NAV = [
  { name: "Check-in", href: "/visitor/checkin", icon: Library },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();

  const navItems = currentUser?.role === 'Admin' ? ADMIN_NAV : VISITOR_NAV;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-primary text-primary-foreground w-64 border-r border-border p-4 shadow-xl">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-accent p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-headline font-bold">Academia Access</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-4 py-6 text-base hover:bg-white/10 hover:text-white transition-all",
                isActive ? "bg-accent text-white font-medium" : "text-primary-foreground/70"
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold">
            {currentUser?.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-primary-foreground/60 truncate">{currentUser?.role}</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
