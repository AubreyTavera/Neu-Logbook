"use client"

import { useState, useMemo } from "react";
import { 
  Users, 
  ArrowUpRight, 
  Library, 
  Building2, 
  Search,
  Filter,
  UserCheck,
  GraduationCap,
  Briefcase,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { StatsFilter, UserType } from "@/lib/types";
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
  
  // Advanced Filters
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
    
    // Base pool of visits filtered by criteria (excluding date for overall calculation)
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

  const resetFilters = () => {
    setCollegeFilter("all");
    setReasonFilter("all");
    setTypeFilter("all");
    setSearchTerm("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">System Overview</h1>
          <p className="text-muted-foreground">Monitoring activity with advanced filters.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['Day', 'Week', 'Month'] as StatsFilter[]).map((f) => (
            <Button
              key={f}
              variant={dateFilter === f ? "default" : "outline"}
              onClick={() => setDateFilter(f)}
              className="px-6 h-10"
            >
              {f}
            </Button>
          ))}
          <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground">Reset All</Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-none shadow-sm bg-muted/30">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">College/Dept</label>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visit Reason</label>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visitor Category</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Employee">Employees (Teacher/Staff)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search visitor..." 
              className="pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-accent/10 p-3 rounded-xl">
                <Users className="text-accent w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Filtered Visits ({dateFilter})</p>
              <h2 className="text-3xl font-bold mt-1">
                {dateFilter === 'Day' ? stats.day : dateFilter === 'Week' ? stats.week : stats.month}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Library className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Library Usage</p>
              <h2 className="text-3xl font-bold mt-1">{stats.libraryUsage}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl">
                <GraduationCap className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Total Students</p>
              <h2 className="text-3xl font-bold mt-1">{stats.studentCount}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Briefcase className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Total Employees</p>
              <h2 className="text-3xl font-bold mt-1">{stats.employeeCount}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Filtered Activity Logs</CardTitle>
            <CardDescription>Detailed view of visitor check-ins matching current criteria.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>Clear Filters</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>College/Dept</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length > 0 ? filteredVisits.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="font-medium">{v.visitorName}</div>
                    <div className="text-xs text-muted-foreground">{v.visitorEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex w-fit gap-1 items-center">
                      {v.visitorType === 'Student' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                      {v.visitorType}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">{v.department}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{v.reasonForVisit}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      v.location === 'Library' ? "border-accent text-accent" : "border-primary text-primary"
                    )}>
                      {v.location}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No records found matching your filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
