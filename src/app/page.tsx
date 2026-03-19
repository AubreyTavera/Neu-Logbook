"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Building2, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@neu.edu.ph")) {
      toast({
        title: "Access Restricted",
        description: "Please use your institutional @neu.edu.ph email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(email);
      setLoading(false);

      if (result.success) {
        if (isAdminMode) {
          router.push("/admin/dashboard");
        } else {
          router.push("/visitor/checkin");
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="bg-card p-3 rounded-2xl shadow-2xl border border-white/5">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/en/c/c6/New_Era_University.svg" 
                alt="NEU Logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-4xl font-headline font-black tracking-tighter text-white">NEU LOGBOOK</h1>
              <p className="text-accent font-medium tracking-widest text-[10px] uppercase">Visitor Management System</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-headline font-bold leading-[1.1] text-white">
              Institutional <br />
              <span className="text-accent">Verification.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              Official digital gateway for students, faculty, and administrators of New Era University.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Secure Auth
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Monitoring
            </div>
          </div>
        </div>

        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/5 bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl font-headline font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Identify your university role to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsAdminMode(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all gap-3 group",
                  !isAdminMode 
                    ? "bg-accent border-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                )}
              >
                <GraduationCap className={cn("w-8 h-8 transition-transform group-hover:scale-110", !isAdminMode ? "text-white" : "text-muted-foreground")} />
                <span className="font-bold text-sm">Student</span>
              </button>
              <button 
                onClick={() => setIsAdminMode(true)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all gap-3 group",
                  isAdminMode 
                    ? "bg-accent border-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                )}
              >
                <Building2 className={cn("w-8 h-8 transition-transform group-hover:scale-110", isAdminMode ? "text-white" : "text-muted-foreground")} />
                <span className="font-bold text-sm">Faculty/Admin</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Institutional Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <Input 
                    placeholder="your.name@neu.edu.ph" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 text-lg rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 bg-accent hover:bg-accent/90 text-white text-lg font-bold rounded-xl shadow-lg transition-all group" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Continue Access
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-4 border-t border-white/5">
              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                Secured by NEU Institutional Systems
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}