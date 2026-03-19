"use client"

import { useState, useMemo } from "react";
import { 
  Users, 
  Library, 
  Building2, 
  Search,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Clock,
  CalendarDays
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
      const matchesReason = reasonFilter === "all" || v.reasonForVisit === reasonFilter;
      const matchesType = typeFilter === "all" || 
                         (typeFilter === "Student" ? v.visitorType === "Student" : v.visitorType === "Teacher" || v.visitorType === "Staff");

      return matchesSearch && matchesCollege && matchesReason && matchesType;
    });
  }, [visits, searchTerm, collegeFilter, reasonFilter, typeFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const baseVisits = visits.filter(v => {
      const matchesCollege = collegeFilter === "all" || v.department === collegeFilter;
      const matchesReason = reasonFilter === "all" || v.reasonForVisit === reasonFilter;
      const matchesType = typeFilter === "all" || 
                         (typeFilter === "Student" ? v.visitorType === "Student" : v.visitorType === "Teacher" || v.visitorType === "Staff");
      return matchesCollege && matchesReason && matchesType;
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
    const deanUsage = baseVisits.filter(v => v.location === 'Dean').length;
    const studentCount = baseVisits.filter(v => v.visitorType === 'Student').length;
    const employeeCount = baseVisits.filter(v => v.visitorType === 'Teacher' || v.visitorType === 'Staff').length;

    return { day, week, month, libraryUsage, deanUsage, studentCount, employeeCount };
  }, [visits, collegeFilter, reasonFilter, typeFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-white tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time visitor analytics for New Era University.</p>
        </div>
        <div className="flex bg-card p-1 rounded-2xl border border-white/5">
          {(['Day', 'Week', 'Month'] as StatsFilter[]).map((f) => (
            <Button
              key={f}
              variant="ghost"
              onClick={() => setDateFilter(f)}
              className={cn(
                "px-6 h-10 rounded-xl transition-all",
                dateFilter === f ? "bg-accent text-white shadow-lg" : "text-muted-foreground hover:text-white"
              )}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-white/5 bg-card/50 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24" />
          </div>
          <CardContent className="p-6">
            <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-accent w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Active Visits</p>
            <h2 className="text-4xl font-black mt-1 text-white">
              {dateFilter === 'Day' ? stats.day : dateFilter === 'Week' ? stats.week : stats.month}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +12% from last {dateFilter.toLowerCase()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50 shadow-xl overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Library className="text-purple-500 w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Library Usage</p>
            <h2 className="text-4xl font-black mt-1 text-white">{stats.libraryUsage}</h2>
            <p className="text-xs text-muted-foreground mt-4">Total recorded facility entry</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50 shadow-xl overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="bg-orange-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="text-orange-500 w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Student Count</p>
            <h2 className="text-4xl font-black mt-1 text-white">{stats.studentCount}</h2>
            <p className="text-xs text-muted-foreground mt-4">Verified institutional students</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50 shadow-xl overflow-hidden relative group">
          <CardContent className="p-6">
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="text-blue-500 w-6 h-6" />
            </div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Employee Count</p>
            <h2 className="text-4xl font-black mt-1 text-white">{stats.employeeCount}</h2>
            <p className="text-xs text-muted-foreground mt-4">Faculty and administrative staff</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-card shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <CardTitle className="text-2xl font-black text-white">Activity Log</CardTitle>
            <CardDescription className="text-muted-foreground">Monitoring all campus facility check-ins.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search visitor..." 
                className="pl-10 w-64 h-11 bg-white/5 border-white/10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-48 h-11 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="py-6 px-8 text-xs font-black uppercase tracking-widest">Visitor</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest">Type</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest">Department</TableHead>
                <TableHead className="text-xs font-black uppercase tracking-widest">Facility</TableHead>
                <TableHead className="py-6 px-8 text-right text-xs font-black uppercase tracking-widest">Check-in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length > 0 ? filteredVisits.map((v) => (
                <TableRow key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black">
                        {v.visitorName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base leading-none mb-1">{v.visitorName}</div>
                        <div className="text-xs text-muted-foreground">{v.visitorEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/10 py-1 px-3">
                      {v.visitorType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-white/80">{v.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", v.location === 'Library' ? "bg-accent" : "bg-purple-500")} />
                      <span className="text-sm text-white font-medium">{v.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Clock className="w-3 h-3 text-accent" />
                        {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <CalendarDays className="w-2 h-2" />
                        {new Date(v.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">No activity records found matching your filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}