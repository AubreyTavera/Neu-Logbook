
"use client"

import { useState, useMemo } from "react";
import { 
  Users, 
  Library, 
  Search,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Clock,
  CalendarDays,
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { StatsFilter } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLLEGES = [
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

export default function AdminDashboard() {
  const { visits } = useAuthStore();
  const [dateFilter, setDateFilter] = useState<StatsFilter>('Day');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const matchesSearch = v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCollege = collegeFilter === "all" || v.department === collegeFilter;
      const matchesType = typeFilter === "all" || 
                         (typeFilter === "Student" ? v.visitorType === "Student" : v.visitorType === "Teacher" || v.visitorType === "Staff");

      return matchesSearch && matchesCollege && matchesType;
    });
  }, [visits, searchTerm, collegeFilter, typeFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const baseVisits = visits.filter(v => {
      const matchesCollege = collegeFilter === "all" || v.department === collegeFilter;
      const matchesType = typeFilter === "all" || 
                         (typeFilter === "Student" ? v.visitorType === "Student" : v.visitorType === "Teacher" || v.visitorType === "Staff");
      return matchesCollege && matchesType;
    });

    const day = baseVisits.filter(v => new Date(v.timestamp).toDateString() === now.toDateString()).length;
    const week = baseVisits.filter(v => {
      const d = new Date(v.timestamp);
      const diff = now.getTime() - d.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
    const month = baseVisits.filter(v => {
      const d = new Date(v.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const libraryUsage = baseVisits.filter(v => v.location === 'Library').length;
    const studentCount = baseVisits.filter(v => v.visitorType === 'Student').length;
    const employeeCount = baseVisits.filter(v => v.visitorType === 'Teacher' || v.visitorType === 'Staff').length;

    return { day, week, month, libraryUsage, studentCount, employeeCount };
  }, [visits, collegeFilter, typeFilter]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">System Operational</Badge>
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
              <CalendarDays className="w-3 h-3" />
              {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-none">Command Center</h1>
          <p className="text-muted-foreground text-lg font-medium">Holistic real-time analytics for New Era University facilities.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {(['Day', 'Week', 'Month'] as StatsFilter[]).map((f) => (
              <Button
                key={f}
                variant="ghost"
                onClick={() => setDateFilter(f)}
                className={cn(
                  "px-8 h-12 rounded-xl transition-all font-black text-xs uppercase tracking-widest",
                  dateFilter === f ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-white"
                )}
              >
                {f}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white/5 border-white/10 font-black text-xs uppercase tracking-widest gap-2 hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Active Check-ins", value: dateFilter === 'Day' ? stats.day : dateFilter === 'Week' ? stats.week : stats.month, icon: Users, color: "text-primary", bg: "bg-primary/10", trend: "+12.4%" },
          { label: "Facility Usage", value: stats.libraryUsage, icon: Library, color: "text-indigo-400", bg: "bg-indigo-400/10", trend: "+5.1%" },
          { label: "Student Traffic", value: stats.studentCount, icon: GraduationCap, color: "text-emerald-400", bg: "bg-emerald-400/10", trend: "+8.2%" },
          { label: "Staff Activity", value: stats.employeeCount, icon: Briefcase, color: "text-amber-400", bg: "bg-amber-400/10", trend: "+3.4%" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-10 space-y-6 relative">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-5xl font-black text-white leading-none">{stat.value}</h2>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-black mb-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 w-6 h-6 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card rounded-[3.5rem] border-white/5 overflow-hidden">
        <CardHeader className="p-12 pb-0 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              <CardTitle className="text-3xl font-black text-white">Live Activity Stream</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground text-lg">Monitoring institutional campus access in real-time.</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search visitor logs..." 
                className="pl-14 w-80 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 text-sm font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-64 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 font-black text-xs uppercase tracking-widest px-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-3 h-3 text-primary" />
                  <SelectValue placeholder="All Colleges" />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 rounded-2xl">
                <SelectItem value="all" className="font-bold py-3">Global (All Depts)</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c} className="py-3">{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 font-black text-xs uppercase tracking-widest px-6">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 rounded-2xl">
                <SelectItem value="all" className="font-bold py-3">All Visitor Types</SelectItem>
                <SelectItem value="Student" className="py-3">Students Only</SelectItem>
                <SelectItem value="Employee" className="py-3">Faculty & Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 bg-white/5 hover:bg-white/5">
                  <TableHead className="py-8 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Visitor Profile</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Affiliation</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Location</TableHead>
                  <TableHead className="py-8 px-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Temporal Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length > 0 ? filteredVisits.map((v) => (
                  <TableRow key={v.id} className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group">
                    <TableCell className="py-8 px-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-indigo-500/30 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                          {v.visitorName[0]}
                        </div>
                        <div>
                          <div className="font-black text-white text-lg tracking-tight mb-1">{v.visitorName}</div>
                          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[9px] uppercase font-black py-0 border-white/10">{v.visitorType}</Badge>
                            {v.visitorEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="text-sm font-black text-white/90 tracking-tight">{v.department}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{v.reasonForVisit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(var(--color))] animate-pulse", 
                          v.location === 'Library' ? "bg-primary" : "bg-indigo-400"
                        )} />
                        <span className="text-sm text-white font-black tracking-tight">{v.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-8 px-10 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-2 text-white font-black text-base">
                          <Clock className="w-4 h-4 text-primary" />
                          {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(v.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-32 text-muted-foreground space-y-4">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-xl font-black text-white/40">No activity records discovered.</p>
                      <p className="text-sm font-medium">Try adjusting your filters or search parameters.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
