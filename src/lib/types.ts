
export type UserRole = 'Admin' | 'Visitor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isBlocked: boolean;
  institutionEmail: string;
}

export interface VisitRecord {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail: string;
  department: string;
  reasonForVisit: string;
  timestamp: string; // ISO string
  status: 'Waiting' | 'In-Meeting' | 'Completed';
  location: 'Library' | 'Dean';
  timeIn: string;
  timeOut?: string;
}

export type StatsFilter = 'Day' | 'Week' | 'Month';
