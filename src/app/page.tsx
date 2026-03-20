
"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Building2, Mail, Loader2, ArrowRight, ShieldCheck, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Short delay to simulate institutional verification
    setTimeout(() => {
      const result = login(email);

      if (result.success && result.user) {
        if (isAdminMode) {
          if (result.user.role === 'admin') {
            toast({
              title: "Identity Verified",
              description: `Welcome, ${result.user.name}. Entering Command Center.`,
            });
            router.push("/admin/dashboard");
          } else {
            setLoading(false);
            setError("Faculty access requires administrative privileges.");
            toast({
              title: "Access Restricted",
              description: "This account is not registered as Faculty/Admin.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Identity Verified",
            description: `Welcome back, ${result.user.name}.`,
          });
          router.push("/visitor/checkin");
        }
      } else {
        setLoading(false);
        setError(result.error || "Verification failed. Check your institutional email.");
      }
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        <div className="space-y-10">
          <div className="flex items-center gap-5">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-white/10 backdrop-blur-md">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/en/c/c6/New_Era_University.svg" 
                alt="NEU Logo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">NEU LOGBOOK</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-1 w-8 bg-primary rounded-full" />
                <p className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase">Digital Entry Gateway</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-6xl xl:text-7xl font-black leading-[0.95] text-foreground tracking-tighter">
              Institutional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Excellence.</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-md leading-relaxed font-medium">
              The official visitor verification and real-time activity management portal for New Era University.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 text-xs font-bold text-foreground bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              SSO SECURED
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-foreground bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
              LIVE LOGGING
            </div>
          </div>
        </div>

        <Card className="glass-card rounded-[3rem] border-white/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="space-y-3 p-12 pb-6">
            <CardTitle className="text-4xl font-black text-foreground">Identity Access</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Select your role to authenticate with the university system.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-12 pt-0 space-y-10">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-bold ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-5">
              <button 
                type="button"
                onClick={() => { setIsAdminMode(false); setError(null); }}
                className={cn(
                  "flex flex-col items-center justify-center p-8 rounded-[2rem] border transition-all gap-4 group/btn",
                  !isAdminMode 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105" 
                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl transition-colors",
                  !isAdminMode ? "bg-white/30" : "bg-white/5"
                )}>
                  <GraduationCap className="w-8 h-8" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Student</span>
              </button>
              
              <button 
                type="button"
                onClick={() => { setIsAdminMode(true); setError(null); }}
                className={cn(
                  "flex flex-col items-center justify-center p-8 rounded-[2rem] border transition-all gap-4 group/btn",
                  isAdminMode 
                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105" 
                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "p-4 rounded-2xl transition-colors",
                  isAdminMode ? "bg-white/30" : "bg-white/5"
                )}>
                  <Building2 className="w-8 h-8" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Faculty</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">
                  Institutional Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="name@neu.edu.ph" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="h-16 pl-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-lg rounded-2xl transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black rounded-2xl shadow-xl transition-all group active:scale-95" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    VERIFY & CONTINUE
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black">
                Official NEU Security Protocol
              </p>
              <Button variant="link" className="text-muted-foreground hover:text-primary text-xs gap-2">
                Need Access Help? <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
