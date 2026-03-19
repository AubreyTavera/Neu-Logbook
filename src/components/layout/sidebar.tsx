"use client"

import { 
  LayoutDashboard, 
  Users, 
  History, 
  FileBarChart, 
  LogOut,
  Library,
  Activity,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Live Sessions", href: "/admin/sessions", icon: Activity },
  { name: "User Directory", href: "/admin/users", icon: Users },
  { name: "Visit History", href: "/admin/history", icon: History },
  { name: "AI Analytics", href: "/admin/reports", icon: FileBarChart },
];

const VISITOR_NAV = [
  { name: "Log My Visit", href: "/visitor/checkin", icon: Library },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();

  const navItems = currentUser?.role === 'admin' ? ADMIN_NAV : VISITOR_NAV;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-card w-72 border-r border-white/5 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] -mr-16 -mt-16" />

      <div className="flex items-center gap-4 mb-12 px-2 relative z-10">
        <div className="bg-white/5 p-2 rounded-xl border border-white/10">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/en/c/c6/New_Era_University.svg" 
            alt="NEU Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-headline font-black tracking-tight text-white leading-none">NEU</h1>
          <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">LOGBOOK</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 relative z-10">
        <div>
          <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Main Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  className={cn(
                    "w-full flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all",
                    isActive 
                      ? "bg-accent/10 text-accent font-bold border border-accent/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-muted-foreground group-hover:text-white")} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-4 px-4 py-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/20 flex items-center justify-center font-bold text-accent">
            {currentUser?.name ? currentUser.name[0] : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-none mb-1">{currentUser?.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">{currentUser?.role}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}