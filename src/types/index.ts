export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  class: string;
  section: string;
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  subjects: string[];
  classes: string[];
}

export interface Admin extends User {
  role: 'admin';
  employeeId: string;
  department: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  teacherId: string;
  students: string[];
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  entries: AttendanceEntry[];
  createdBy: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface AttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success' | 'error';
}