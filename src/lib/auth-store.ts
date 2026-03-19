
"use client"

import { User, UserRole, VisitRecord } from "./types";
import { useState, useEffect } from "react";

// Initial mock data
const MOCK_ADMIN: User = {
  id: "admin-1",
  email: "admin@academia.edu",
  name: "Dr. Admin Professor",
  role: "Admin",
  isBlocked: false,
  institutionEmail: "admin@academia.edu"
};

const MOCK_USERS: User[] = [
  MOCK_ADMIN,
  {
    id: "user-1",
    email: "visitor@academia.edu",
    name: "John Doe Student",
    role: "Visitor",
    isBlocked: false,
    institutionEmail: "visitor@academia.edu"
  }
];

const INITIAL_VISITS: VisitRecord[] = [
  {
    id: "v1",
    visitorId: "user-1",
    visitorName: "John Doe Student",
    visitorEmail: "visitor@academia.edu",
    department: "College of Engineering",
    reasonForVisit: "Research Project",
    timestamp: new Date().toISOString(),
    status: "Completed",
    location: "Library",
    timeIn: new Date(Date.now() - 3600000).toISOString(),
    timeOut: new Date().toISOString(),
  }
];

export function useAuthStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [visits, setVisits] = useState<VisitRecord[]>(INITIAL_VISITS);

  // Sync with local storage if needed or just use memory for this demo
  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      if (user.isBlocked) return { error: "Your account is blocked." };
      setCurrentUser(user);
      return { success: true };
    }
    return { error: "User not found or invalid institutional email." };
  };

  const logout = () => setCurrentUser(null);

  const checkIn = (visit: Omit<VisitRecord, "id" | "timestamp" | "status" | "timeIn">) => {
    const newVisit: VisitRecord = {
      ...visit,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: "Waiting",
      timeIn: new Date().toISOString(),
    };
    setVisits([newVisit, ...visits]);
    return newVisit;
  };

  const toggleBlockUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
  };

  return {
    currentUser,
    users,
    visits,
    login,
    logout,
    checkIn,
    toggleBlockUser,
    setVisits
  };
}
