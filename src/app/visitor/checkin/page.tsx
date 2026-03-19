
"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Library, BookOpen, Clock } from "lucide-react";

const DEPARTMENTS = [
  "College of Engineering",
  "College of Arts and Sciences",
  "College of Education",
  "College of Law",
  "College of Business Administration",
  "Graduate School",
];

const REASONS = [
  "Research",
  "Study Session",
  "Book Borrowing/Return",
  "Computer Lab Usage",
  "Meeting with Librarian",
  "Others",
];

export default function CheckInPage() {
  const { currentUser, checkIn } = useAuthStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    reason: "",
    location: "Library" as "Library" | "Dean",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      checkIn({
        visitorId: currentUser?.id || "anon",
        visitorName: currentUser?.name || "Anonymous",
        visitorEmail: currentUser?.email || "anon@academia.edu",
        department: formData.department,
        reasonForVisit: formData.reason,
        location: formData.location,
        timeIn: new Date().toISOString(),
      });
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Check-in Successful!",
        description: "Welcome to Academia Access.",
      });
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-border">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
            </div>
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-2">Welcome!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your check-in at the <strong>{formData.location}</strong> has been recorded successfully.
          </p>
          <div className="space-y-3">
            <Button className="w-full bg-primary" onClick={() => setSubmitted(false)}>
              Make Another Check-in
            </Button>
            <p className="text-xs text-muted-foreground">
              Please observe quietness and institutional rules.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold text-primary">Visitor Check-in</h1>
        <p className="text-muted-foreground">Welcome, {currentUser?.name}. Please log your visit details below.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Visit Details</CardTitle>
              <CardDescription>Information collected for institutional statistics.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select onValueChange={(val) => setFormData({...formData, department: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facility</label>
                    <Select defaultValue="Library" onValueChange={(val: any) => setFormData({...formData, location: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Library">Library</SelectItem>
                        <SelectItem value="Dean">Dean's Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Visit</label>
                  <Select onValueChange={(val) => setFormData({...formData, reason: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {REASONS.map(reason => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes (Optional)</label>
                  <Textarea placeholder="Briefly describe your purpose..." />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6 text-lg" disabled={loading}>
                  {loading ? "Checking you in..." : "Submit Check-in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Library className="w-5 h-5" />
                <h3 className="font-bold">Library Guidelines</h3>
              </div>
              <ul className="text-sm space-y-2 opacity-80">
                <li className="flex gap-2"><span>•</span> Silence must be maintained.</li>
                <li className="flex gap-2"><span>•</span> No food inside the premises.</li>
                <li className="flex gap-2"><span>•</span> Secure your belongings.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold">Operating Hours</h3>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mon - Fri:</span>
                  <span className="font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday:</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday:</span>
                  <span className="font-medium text-destructive">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
