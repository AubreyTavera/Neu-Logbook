
"use client"

import { 
  LayoutDashboard, 
  Users, 
  History, 
  FileBarChart, 
  LogOut,
  Library,
  Activity,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

const ADMIN_NAV = [
  { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Active Sessions", href: "/admin/sessions", icon: Activity },
  { name: "User Registry", href: "/admin/users", icon: Users },
  { name: "Audit Logs", href: "/admin/history", icon: History },
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
    <div className="flex flex-col h-full bg-[#0a0a0c] w-80 border-r border-white/5 p-8 shadow-2xl relative overflow-hidden shrink-0">
      {/* Dynamic Background Light */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 animate-pulse" />

      <div className="flex items-center gap-5 mb-16 relative z-10 px-2">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl group hover:border-primary/50 transition-colors">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/en/c/c6/New_Era_University.svg" 
            alt="NEU Logo"
            width={40}
            height={40}
            className="object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none">NEU</h1>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Zap className="w-3 h-3 text-primary" />
            <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">Logbook 2.0</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-12 relative z-10">
        <div>
          <p className="px-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6">System Management</p>
          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  className={cn(
                    "w-full flex items-center justify-between group px-6 py-4 rounded-2xl transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-primary text-white font-bold shadow-[0_10px_20px_rgba(59,130,246,0.2)]" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary/50 transition-all" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {currentUser?.role === 'admin' && (
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 relative overflow-hidden group">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-black text-white mb-2 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Secure Access
            </h4>
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              Institutional Admin permissions are active for this session.
            </p>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-5 px-5 py-5 bg-white/5 rounded-[2rem] border border-white/10 mb-8 hover:border-white/20 transition-all cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-lg shadow-inner">
            {currentUser?.name ? currentUser.name[0] : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate leading-none mb-1.5">{currentUser?.name}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{currentUser?.role}</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 h-14 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-2xl px-6 transition-all group"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-sm uppercase tracking-widest">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
