
export type UserRole = 'Admin' | 'Visitor';
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
