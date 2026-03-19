"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Library, Clock, ShieldAlert, Navigation } from "lucide-react";
import { UserType } from "@/lib/types";
import { cn } from "@/lib/utils";

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
        title: "Incomplete Log",
        description: "Please specify your department and reason for visit.",
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
        title: "Visit Authenticated",
        description: "Your check-in has been registered in the logbook.",
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-card p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <div className="flex justify-center mb-8">
            <div className="bg-accent/10 p-6 rounded-full border border-accent/20">
              <CheckCircle2 className="w-20 h-20 text-accent animate-in slide-in-from-bottom-4" />
            </div>
          </div>
          <h2 className="text-4xl font-headline font-black text-white mb-3">Check-in Successful</h2>
          <p className="text-muted-foreground text-lg mb-10">
            Welcome to the <span className="text-accent font-bold">{formData.location}</span>. Your attendance has been logged at New Era University.
          </p>
          <div className="space-y-4 max-w-xs mx-auto">
            <Button className="w-full h-14 bg-accent text-white font-bold rounded-2xl shadow-lg" onClick={() => setSubmitted(false)}>
              Back to Dashboard
            </Button>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-accent text-white px-3 py-1 font-bold">Live Entry</Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <Navigation className="w-3 h-3" />
            Facility Check-in
          </div>
        </div>
        <h1 className="text-5xl font-headline font-black text-white tracking-tight">University Logbook</h1>
        <p className="text-muted-foreground text-lg">Welcome back, <span className="text-white font-bold">{currentUser?.name}</span>. Please verify your visit details.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card className="border-white/5 bg-card shadow-2xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-2xl font-black text-white">Logbook Entry</CardTitle>
              <CardDescription className="text-muted-foreground">Digital verification of your campus activity.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">My Designation</label>
                    <Select defaultValue={formData.visitorType} onValueChange={(val: UserType) => setFormData({...formData, visitorType: val})}>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent/20">
                        <SelectValue placeholder="Are you a Student/Teacher?" />
                      </SelectTrigger>
                      <SelectContent>
                        {VISITOR_TYPES.map(type => (
                          <SelectItem key={type} value={type} className="py-3">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Target Facility</label>
                    <Select defaultValue="Library" onValueChange={(val: any) => setFormData({...formData, location: val})}>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent/20">
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Library" className="py-3">Main Library</SelectItem>
                        <SelectItem value="Dean" className="py-3">Dean's Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Institutional Department</label>
                    <Select onValueChange={(val) => setFormData({...formData, department: val})}>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent/20">
                        <SelectValue placeholder="Select College/Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept} className="py-3">{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Visit Motivation</label>
                    <Select onValueChange={(val) => setFormData({...formData, reason: val})}>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent/20">
                        <SelectValue placeholder="Select Primary Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {REASONS.map(reason => (
                          <SelectItem key={reason} value={reason} className="py-3">{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Additional Context (Optional)</label>
                  <Textarea 
                    placeholder="Enter visit details or specific requirements..." 
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:ring-accent/20 resize-none p-4"
                  />
                </div>

                <Button type="submit" className="w-full h-16 bg-accent hover:bg-accent/90 text-white py-6 text-xl font-black rounded-2xl shadow-xl transition-all group" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 animate-spin" />
                      Recording Entry...
                    </div>
                  ) : (
                    "SUBMIT LOGBOOK ENTRY"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-accent text-white border-none shadow-[0_15px_40px_rgba(59,130,246,0.2)] rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Guidelines</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Observe institutional dress code policy.",
                  "Maintain silence in academic zones.",
                  "Keep a digital record of check-out time.",
                  "Secure all personal electronic devices."
                ].map((text, i) => (
                  <li key={i} className="flex gap-4 items-start text-sm font-medium opacity-90">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {i+1}
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/50 shadow-xl rounded-[2rem]">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="font-black text-lg">Operating Hours</h3>
              </div>
              <div className="space-y-4">
                {[
                  { days: "Mon - Fri", hours: "8:00 AM - 8:00 PM" },
                  { days: "Saturday", hours: "9:00 AM - 5:00 PM" },
                  { days: "Sunday", hours: "Closed", closed: true }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-muted-foreground text-sm font-bold">{item.days}</span>
                    <span className={cn("text-sm font-black", item.closed ? "text-destructive" : "text-white")}>{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 p-4 rounded-xl flex gap-3">
                <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase leading-normal">
                  Unauthorized access is strictly prohibited. Identity verification active.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}