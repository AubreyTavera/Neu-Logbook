
"use client"

import { User, VisitRecord, UserType } from "./types";
import { useState, useEffect } from "react";

// Initial mock data
const MOCK_ADMIN: User = {
  id: "admin-1",
  email: "admin@neu.edu.ph",
  name: "Dr. Admin Professor",
  role: "Admin",
  userType: "Staff",
  isBlocked: false,
  institutionEmail: "admin@neu.edu.ph"
};

const MOCK_USERS: User[] = [
  MOCK_ADMIN,
  {
    id: "user-1",
    email: "visitor@neu.edu.ph",
    name: "John Doe Student",
    role: "Visitor",
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

// Module-level state to persist across hook instances for this session
let globalUsers: User[] = [...MOCK_USERS];
let globalVisits: VisitRecord[] = [...INITIAL_VISITS];
let globalCurrentUser: User | null = null;
const listeners: Set<() => void> = new Set();

const notify = () => listeners.forEach(l => l());

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
    // Check if user already exists
    let user = globalUsers.find(u => u.email === email);
    
    // If user doesn't exist but has the right domain, auto-register them
    if (!user && email.endsWith("@neu.edu.ph")) {
      const namePrefix = email.split('@')[0];
      const formattedName = namePrefix
        .split(/[._-]/)
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');

      // Designate anything starting with "admin" or "dean" as Admin role
      const isAdmin = email.startsWith("admin") || email.startsWith("dean");

      user = {
        id: `u-${Date.now()}`,
        email: email,
        name: formattedName || "New User",
        role: isAdmin ? "Admin" : "Visitor",
        userType: isAdmin ? "Staff" : "Student",
        isBlocked: false,
        institutionEmail: email
      };
      globalUsers = [...globalUsers, user];
    }

    if (user) {
      if (user.isBlocked) return { error: "Your account is blocked." };
      globalCurrentUser = user;
      notify();
      return { success: true };
    }
    
    return { error: "Invalid institutional email domain." };
  };

  const logout = () => {
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

  const setVisits = (newVisits: VisitRecord[]) => {
    globalVisits = newVisits;
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
    setVisits
  };
}
