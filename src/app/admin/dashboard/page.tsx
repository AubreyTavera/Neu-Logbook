
"use client"

import { useState, useMemo } from "react";
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Library, 
  Building2, 
  Calendar, 
  Search,
  Filter,
  UserCheck
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
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { visits } = useAuthStore();
  const [filter, setFilter] = useState<StatsFilter>('Day');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVisits = useMemo(() => {
    return visits.filter(v => 
      v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visits, searchTerm]);

  const stats = useMemo(() => {
    const now = new Date();
    const day = visits.filter(v => new Date(v.timestamp).toDateString() === now.toDateString()).length;
    const week = visits.filter(v => {
      const d = new Date(v.timestamp);
      const diff = now.getTime() - d.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
    const month = visits.filter(v => {
      const d = new Date(v.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return { day, week, month };
  }, [visits]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">System Overview</h1>
          <p className="text-muted-foreground">Monitoring visitor activity in real-time.</p>
        </div>
        <div className="flex gap-2">
          {(['Day', 'Week', 'Month'] as StatsFilter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className="px-6"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-accent/10 p-3 rounded-xl">
                <Users className="text-accent w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Total Visitors ({filter})</p>
              <h2 className="text-3xl font-bold mt-1">
                {filter === 'Day' ? stats.day : filter === 'Week' ? stats.week : stats.month}
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
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 8%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Library Usage</p>
              <h2 className="text-3xl font-bold mt-1">{visits.filter(v => v.location === 'Library').length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Building2 className="text-primary w-6 h-6" />
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                <ArrowDownRight className="w-3 h-3 mr-1" /> 2%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Dean's Office Log</p>
              <h2 className="text-3xl font-bold mt-1">{visits.filter(v => v.location === 'Dean').length}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl">
                <UserCheck className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">New Registered</p>
              <h2 className="text-3xl font-bold mt-1">42</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A live list of visitor check-ins.</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search visitor or dept..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length > 0 ? filteredVisits.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="font-medium">{v.visitorName}</div>
                    <div className="text-xs text-muted-foreground">{v.visitorEmail}</div>
                  </TableCell>
                  <TableCell>{v.department}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{v.reasonForVisit}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      v.location === 'Library' ? "border-accent text-accent" : "border-primary text-primary"
                    )}>
                      {v.location}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      v.status === 'Completed' ? "bg-green-500" : "bg-yellow-500"
                    )}>
                      {v.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No records found matching your search.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
