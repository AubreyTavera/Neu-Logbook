
"use client"

import { User, VisitRecord } from "./types";
import { useState, useEffect } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// Initial mock data
const MOCK_ADMIN: User = {
  id: "admin-1",
  email: "jcesperanza@neu.edu.ph",
  name: "JC Esperanza",
  role: "admin",
  userType: "Staff",
  isBlocked: false,
  institutionEmail: "jcesperanza@neu.edu.ph"
};

const MOCK_USERS: User[] = [
  MOCK_ADMIN,
  {
    id: "user-1",
    email: "visitor@neu.edu.ph",
    name: "John Doe Student",
    role: "visitor",
    userType: "Student",
    isBlocked: false,
    institutionEmail: "visitor@neu.edu.ph"
  }
];

const INITIAL_VISITS: VisitRecord[] = [
  {
    id: "v1",
    visitorId: "user-1",
    visitorName: "John Doe Student",
    visitorEmail: "visitor@neu.edu.ph",
    visitorType: "Student",
    department: "College of Engineering",
    reasonForVisit: "Research Project",
    timestamp: new Date().toISOString(),
    status: "Completed",
    location: "Library",
    timeIn: new Date(Date.now() - 3600000).toISOString(),
    timeOut: new Date().toISOString(),
  }
];

// Module-level state to persist across hook instances
let globalUsers: User[] = [...MOCK_USERS];
let globalVisits: VisitRecord[] = [...INITIAL_VISITS];
let globalCurrentUser: User | null = null;
const listeners: Set<() => void> = new Set();

const notify = () => {
  if (typeof window !== 'undefined') {
    listeners.forEach(l => l());
  }
};

export function useAuthStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const forceUpdate = () => setTick(t => t + 1);
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);

  const login = (email: string) => {
    try {
      if (!email) return { error: "Institutional email is required." };
      
      const normalizedEmail = email.toLowerCase().trim();
      
      if (!normalizedEmail.endsWith("@neu.edu.ph")) {
        return { error: "Access denied. Only @neu.edu.ph emails are permitted." };
      }

      // Check if user already exists
      let user = globalUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      
      // Auto-registration for institutional emails
      if (!user) {
        const namePrefix = normalizedEmail.split('@')[0];
        const formattedName = namePrefix
          .split(/[._-]/)
          .map(s => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');

        const isAdmin = normalizedEmail === "jcesperanza@neu.edu.ph";

        user = {
          id: `u-${Date.now()}`,
          email: normalizedEmail,
          name: formattedName || "New User",
          role: isAdmin ? "admin" : "visitor",
          userType: isAdmin ? "Staff" : "Student",
          isBlocked: false,
          institutionEmail: normalizedEmail
        };
        globalUsers = [...globalUsers, user];
      }

      if (user.isBlocked) return { error: "Account suspended. Contact administration." };
      
      globalCurrentUser = user;

      // Asynchronous session tracking (non-blocking)
      if (db) {
        const sessionRef = doc(db, 'sessions', user.id);
        const sessionData = {
          uid: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
        };

        setDoc(sessionRef, sessionData).catch(() => {
          // Silent fail for session tracking
        });
      }

      notify();
      return { success: true, user };
    } catch (err) {
      return { error: "System verification error." };
    }
  };

  const logout = () => {
    if (globalCurrentUser && db) {
      const sessionRef = doc(db, 'sessions', globalCurrentUser.id);
      deleteDoc(sessionRef).catch(() => {});
    }
    globalCurrentUser = null;
    notify();
  };

  const checkIn = (visit: Omit<VisitRecord, "id" | "timestamp" | "status" | "timeIn">) => {
    const newVisit: VisitRecord = {
      ...visit,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: "Waiting",
      timeIn: new Date().toISOString(),
    };
    globalVisits = [newVisit, ...globalVisits];
    notify();
    return newVisit;
  };

  const toggleBlockUser = (userId: string) => {
    globalUsers = globalUsers.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u);
    notify();
  };

  return {
    currentUser: globalCurrentUser,
    users: globalUsers,
    visits: globalVisits,
    login,
    logout,
    checkIn,
    toggleBlockUser,
  };
}
