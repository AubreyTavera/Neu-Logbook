
"use client"

import { useMemo } from "react";
import { Users, Monitor, Smartphone, Globe, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { UserSession } from "@/lib/types";

export default function ActiveSessionsPage() {
  const db = useFirestore();
  
  const sessionsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "sessions"), orderBy("loginTime", "desc"));
  }, [db]);

  const { data: sessions, loading } = useCollection<UserSession>(sessionsQuery);

  const stats = useMemo(() => {
    const total = sessions.length;
    const admins = sessions.filter(s => s.role === 'admin').length;
    const visitors = total - admins;
    const mobileCount = sessions.filter(s => /mobile|android|iphone|ipad/i.test(s.userAgent)).length;
    return { total, admins, visitors, mobileCount };
  }, [sessions]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Active Sessions</h1>
          <p className="text-muted-foreground">Real-time monitoring of currently logged-in institutional users.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-8 gap-1.5 px-3 border-accent text-accent animate-pulse">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Live Updates Enabled
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Total Active</p>
              <h2 className="text-3xl font-bold mt-1">{stats.total}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-accent/10 p-3 rounded-xl text-accent">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Admins Online</p>
              <h2 className="text-3xl font-bold mt-1">{stats.admins}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-secondary/20 p-3 rounded-xl text-secondary-foreground">
                <Globe className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Desktop Sessions</p>
              <h2 className="text-3xl font-bold mt-1">{stats.total - stats.mobileCount}</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Mobile Sessions</p>
              <h2 className="text-3xl font-bold mt-1">{stats.mobileCount}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>A live list of users currently authenticated in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Login Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading active sessions...</TableCell>
                </TableRow>
              ) : sessions.length > 0 ? (
                sessions.map((session) => {
                  const isMobile = /mobile|android|iphone|ipad/i.test(session.userAgent);
                  return (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="font-medium">{session.name}</div>
                        <div className="text-xs text-muted-foreground">{session.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.role === 'admin' ? "default" : "secondary"}>
                          {session.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isMobile ? <Smartphone className="w-4 h-4 text-orange-500" /> : <Monitor className="w-4 h-4 text-blue-500" />}
                          <span className="text-xs truncate max-w-[200px]">{isMobile ? "Mobile Device" : "Desktop/Web Browser"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {new Date(session.loginTime).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                    No active sessions found.
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
