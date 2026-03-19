"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Building2, Library, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";

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

    // Artificial delay for UX
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-accent rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-primary rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-border">
              <Image 
                src="https://upload.wikimedia.org/wikipedia/en/c/c6/New_Era_University.svg" 
                alt="New Era University Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-headline font-extrabold text-primary">Academia Access</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-headline font-bold leading-tight">
              Secure Campus Visitor <span className="text-accent">Management</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Streamlining facility usage and professional logbooks for institutional excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 border border-border p-4 rounded-xl flex items-center gap-3">
              <Library className="text-accent" />
              <span className="text-sm font-medium">Library Flow</span>
            </div>
            <div className="bg-white/50 border border-border p-4 rounded-xl flex items-center gap-3">
              <Building2 className="text-accent" />
              <span className="text-sm font-medium">Dean's Log</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-headline">
              {isAdminMode ? "Faculty/Admin Verification" : "Institutional Login"}
            </CardTitle>
            <CardDescription>
              {isAdminMode 
                ? "Enter your institutional email for administrative access." 
                : "Sign in with your university email (@neu.edu.ph)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Institutional Email
                </label>
                <Input 
                  placeholder="your.name@neu.edu.ph" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-lg"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-medium" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isAdminMode ? "Verify Access" : "Continue as Visitor"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Select Access Level</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={!isAdminMode ? "secondary" : "outline"} 
                className="h-20 flex-col gap-2" 
                onClick={() => setIsAdminMode(false)}
              >
                <GraduationCap className="w-6 h-6" />
                <span>Student</span>
              </Button>
              <Button 
                variant={isAdminMode ? "secondary" : "outline"} 
                className="h-20 flex-col gap-2" 
                onClick={() => setIsAdminMode(true)}
              >
                <Building2 className="w-6 h-6" />
                <span>Faculty/Admin</span>
              </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest">
              Institutional Security Protocol Active
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
