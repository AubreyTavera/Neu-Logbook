
"use client"

import { useState } from "react";
import { History, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
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

export default function HistoryPage() {
  const { visits } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVisits = visits.filter(v => 
    v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Comprehensive Logbook</h1>
          <p className="text-muted-foreground">Complete historical record of all institutional visits.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by visitor or department..." 
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-6">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-6 py-4">Visitor Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length > 0 ? filteredVisits.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="pl-6 py-4">
                    <div className="font-bold">{v.visitorName}</div>
                    <div className="text-xs text-muted-foreground">{v.visitorEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={v.location === 'Library' ? "text-accent" : "text-primary"}>
                      {v.location}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{v.reasonForVisit}</TableCell>
                  <TableCell>{v.department}</TableCell>
                  <TableCell>{new Date(v.timeIn).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                  <TableCell>{v.timeOut ? new Date(v.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}</TableCell>
                  <TableCell className="pr-6">
                    <Badge className={cn(
                      v.status === 'Completed' ? "bg-green-500" : "bg-yellow-500"
                    )}>
                      {v.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-muted-foreground italic">
                    No visit history available yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
