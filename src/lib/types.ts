
export type UserRole = 'admin' | 'visitor';
export type UserType = 'Student' | 'Teacher' | 'Staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  userType: UserType;
  isBlocked: boolean;
  institutionEmail: string;
}

export interface UserSession {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  loginTime: string;
  userAgent: string;
}

export interface VisitRecord {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail: string;
  visitorType: UserType;
  department: string;
  reasonForVisit: string;
  timestamp: string; // ISO string
  status: 'Waiting' | 'In-Meeting' | 'Completed';
  location: 'Library' | 'Dean';
  timeIn: string;
  timeOut?: string;
}

export type StatsFilter = 'Day' | 'Week' | 'Month';
