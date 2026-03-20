
"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Library, Clock, ShieldAlert, Navigation, Sparkles, Building2, UserCircle2 } from "lucide-react";
import { UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DEPARTMENTS = [
  "College of Agriculture",
  "College of Arts and Sciences",
  "College of Business Administration",
  "College of Communication",
  "College of Computer Studies",
  "College of Criminology",
  "College of Education",
  "College of Engineering",
  "College of Law",
  "College of Medicine",
  "College of Music",
  "College of Nursing",
  "School of Management",
  "Graduate School",
];

const REASONS = [
  "Research",
  "Study Session",
  "Book Borrowing/Return",
  "Computer Lab Usage",
  "Meeting with Librarian",
  "Consultation",
  "Administrative Matter",
  "Others",
];

const VISITOR_TYPES: UserType[] = ["Student", "Teacher", "Staff"];

export default function CheckInPage() {
  const { currentUser, checkIn } = useAuthStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    reason: "",
    visitorType: currentUser?.userType || "Student" as UserType,
    location: "Library" as "Library" | "Dean",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department || !formData.reason) {
      toast({
        title: "Entry Incomplete",
        description: "Institutional department and visit reason are mandatory.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      checkIn({
        visitorId: currentUser?.id || "anon",
        visitorName: currentUser?.name || "Anonymous",
        visitorEmail: currentUser?.email || "anon@neu.edu.ph",
        visitorType: formData.visitorType,
        department: formData.department,
        reasonForVisit: formData.reason,
        location: formData.location,
        timeIn: new Date().toISOString(),
      });
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Log Entry Authenticated",
        description: "Your campus check-in is now globally recorded.",
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in zoom-in-95 duration-700">
        <div className="max-w-xl w-full glass-card rounded-[4rem] p-16 text-center space-y-10 relative overflow-hidden border-white/10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-indigo-500" />
          
          <div className="flex justify-center">
            <div className="bg-primary/20 p-8 rounded-[2.5rem] border border-primary/30 relative">
              <CheckCircle2 className="w-24 h-24 text-primary animate-bounce shadow-2xl" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white tracking-tighter">Check-in Verified</h2>
            <p className="text-muted-foreground text-xl font-medium">
              Your visit to the <span className="text-primary font-black uppercase tracking-widest">{formData.location}</span> has been authenticated.
            </p>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span>Security Token</span>
              <span className="text-primary">{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span>Timestamp</span>
              <span className="text-white">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <Button className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-2xl text-lg uppercase tracking-widest active:scale-95 transition-all" onClick={() => setSubmitted(false)}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Badge className="bg-primary text-white px-5 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-full">Secure Entry</Badge>
          <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            New Era University Facility Access
          </div>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter leading-none">Log Your Visit</h1>
        <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-2xl">
          Authenticated as <span className="text-white font-black underline decoration-primary underline-offset-8 decoration-4">{currentUser?.name}</span>. Verify your current campus activity below.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Card className="glass-card rounded-[3.5rem] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <CardHeader className="p-12 pb-0">
              <div className="flex items-center gap-4 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle className="text-3xl font-black text-white">Entry Manifest</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-lg">Digital verification of your institutional check-in.</CardDescription>
            </CardHeader>
            <CardContent className="p-12 space-y-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2 flex items-center gap-2">
                      <UserCircle2 className="w-3 h-3 text-primary" /> Designation
                    </label>
                    <Select defaultValue={formData.visitorType} onValueChange={(val: UserType) => setFormData({...formData, visitorType: val})}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] focus:ring-primary/20 px-8 text-sm font-bold tracking-tight">
                        <SelectValue placeholder="Are you a Student/Teacher?" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 rounded-2xl">
                        {VISITOR_TYPES.map(type => (
                          <SelectItem key={type} value={type} className="py-4 font-bold">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2 flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-primary" /> Facility
                    </label>
                    <Select defaultValue="Library" onValueChange={(val: any) => setFormData({...formData, location: val})}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] focus:ring-primary/20 px-8 text-sm font-bold tracking-tight">
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 rounded-2xl">
                        <SelectItem value="Library" className="py-4 font-bold">University Main Library</SelectItem>
                        <SelectItem value="Dean" className="py-4 font-bold">College Dean's Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Affiliation (College)</label>
                    <Select onValueChange={(val) => setFormData({...formData, department: val})}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] focus:ring-primary/20 px-8 text-sm font-bold tracking-tight">
                        <SelectValue placeholder="Select Institutional Dept" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 rounded-2xl max-h-[400px]">
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept} className="py-4 font-bold">{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Primary Intent</label>
                    <Select onValueChange={(val) => setFormData({...formData, reason: val})}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] focus:ring-primary/20 px-8 text-sm font-bold tracking-tight">
                        <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 rounded-2xl">
                        {REASONS.map(reason => (
                          <SelectItem key={reason} value={reason} className="py-4 font-bold">{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground ml-2">Session Context (Optional)</label>
                  <Textarea 
                    placeholder="Provide additional details regarding your visit..." 
                    className="min-h-[160px] bg-white/5 border-white/10 rounded-[2rem] focus:ring-primary/20 resize-none p-8 text-sm font-medium leading-relaxed"
                  />
                </div>

                <Button type="submit" className="w-full h-20 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-[2rem] shadow-[0_20px_60px_rgba(59,130,246,0.3)] transition-all group active:scale-[0.98]" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <Clock className="w-8 h-8 animate-spin" />
                      COMMITTING ENTRY...
                    </div>
                  ) : (
                    "AUTHENTICATE LOGBOOK ENTRY"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <Card className="bg-primary text-white border-none shadow-[0_30px_70px_rgba(59,130,246,0.25)] rounded-[3rem] overflow-hidden group">
            <CardContent className="p-10 space-y-8 relative">
              <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-[40px] group-hover:scale-125 transition-transform" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="bg-white/20 p-4 rounded-3xl">
                  <Library className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Entry Protocols</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                {[
                  "Maintain strict institutional dress code standards.",
                  "Academic silence policy in effect for all zones.",
                  "Digital check-out is mandatory for data accuracy.",
                  "Surveillance and ID verification active."
                ].map((text, i) => (
                  <li key={i} className="flex gap-5 items-start text-sm font-bold opacity-90 leading-relaxed">
                    <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-black">
                      {i+1}
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-[3rem] border-white/5 p-10 space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="font-black text-xl tracking-tight">Operational Hours</h3>
            </div>
            <div className="space-y-6">
              {[
                { days: "Mon - Friday", hours: "08:00 AM - 08:00 PM" },
                { days: "Saturday", hours: "09:00 AM - 05:00 PM" },
                { days: "Sunday", hours: "Institutional Holiday", closed: true }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <span className="text-muted-foreground text-xs font-black uppercase tracking-widest">{item.days}</span>
                  <span className={cn("text-sm font-black tracking-tight", item.closed ? "text-destructive" : "text-white")}>{item.hours}</span>
                </div>
              ))}
            </div>
            <div className="bg-orange-500/10 p-6 rounded-[1.5rem] border border-orange-500/20 flex gap-4">
              <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-[10px] text-orange-200/80 font-black uppercase tracking-[0.15em] leading-relaxed">
                Security alert: Unauthorized entry will trigger immediate administrative notification.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
