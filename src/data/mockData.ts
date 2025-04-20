import { User, Student, Teacher, Admin, Class, AttendanceRecord, Notification } from '../types';
import { addDays, format, subDays } from 'date-fns';

// Generate mock users
export const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@school.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Michael Williams',
    email: 'michael.williams@school.edu',
    role: 'student',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Jessica Brown',
    email: 'jessica.brown@school.edu',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'David Miller',
    email: 'david.miller@school.edu',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '6',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@school.edu',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const students: Student[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@school.edu',
    role: 'student',
    studentId: 'S10001',
    class: '10',
    section: 'A',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.johnson@school.edu',
    role: 'student',
    studentId: 'S10002',
    class: '10',
    section: 'A',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Michael Williams',
    email: 'michael.williams@school.edu',
    role: 'student',
    studentId: 'S10003',
    class: '10',
    section: 'B',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '7',
    name: 'Olivia Davis',
    email: 'olivia.davis@school.edu',
    role: 'student',
    studentId: 'S10004',
    class: '10',
    section: 'B',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '8',
    name: 'Daniel Taylor',
    email: 'daniel.taylor@school.edu',
    role: 'student',
    studentId: 'S10005',
    class: '11',
    section: 'A',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const teachers: Teacher[] = [
  {
    id: '4',
    name: 'Jessica Brown',
    email: 'jessica.brown@school.edu',
    role: 'teacher',
    employeeId: 'T2001',
    subjects: ['Mathematics', 'Physics'],
    classes: ['10A', '11A'],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'David Miller',
    email: 'david.miller@school.edu',
    role: 'teacher',
    employeeId: 'T2002',
    subjects: ['English', 'History'],
    classes: ['10B', '11B'],
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const admins: Admin[] = [
  {
    id: '6',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@school.edu',
    role: 'admin',
    employeeId: 'A3001',
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const classes: Class[] = [
  {
    id: '1',
    name: 'Mathematics',
    section: '10A',
    teacherId: '4',
    students: ['1', '2'],
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '10:00' },
      { day: 'Wednesday', startTime: '11:00', endTime: '12:00' },
      { day: 'Friday', startTime: '09:00', endTime: '10:00' }
    ]
  },
  {
    id: '2',
    name: 'English',
    section: '10B',
    teacherId: '5',
    students: ['3', '7'],
    schedule: [
      { day: 'Monday', startTime: '11:00', endTime: '12:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '10:00' }
    ]
  },
  {
    id: '3',
    name: 'Physics',
    section: '11A',
    teacherId: '4',
    students: ['8'],
    schedule: [
      { day: 'Tuesday', startTime: '09:00', endTime: '10:00' },
      { day: 'Thursday', startTime: '11:00', endTime: '12:00' }
    ]
  }
];

// Generate attendance records for the past 7 days
export const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // For each class
  classes.forEach(cls => {
    // For the last 7 days
    for (let i = 7; i > 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Skip weekends
      const dayOfWeek = format(date, 'EEEE');
      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        continue;
      }
      
      // Check if class is scheduled for this day
      const isScheduled = cls.schedule.some(s => s.day === dayOfWeek);
      if (!isScheduled) {
        continue;
      }
      
      // Create attendance record
      const record: AttendanceRecord = {
        id: `${cls.id}-${dateStr}`,
        classId: cls.id,
        date: dateStr,
        createdBy: cls.teacherId,
        entries: []
      };
      
      // Add attendance entries for each student
      cls.students.forEach(studentId => {
        // Randomly determine status (80% chance of present)
        const random = Math.random();
        let status: 'present' | 'absent' | 'late' | 'excused';
        
        if (random < 0.8) {
          status = 'present';
        } else if (random < 0.9) {
          status = 'late';
        } else if (random < 0.95) {
          status = 'absent';
        } else {
          status = 'excused';
        }
        
        record.entries.push({
          studentId,
          status,
          notes: status !== 'present' ? 'Auto-generated note' : undefined
        });
      });
      
      records.push(record);
    }
  });
  
  return records;
};

export const attendanceRecords = generateAttendanceRecords();

export const notifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'You have been marked absent in Mathematics class',
    read: false,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    type: 'warning'
  },
  {
    id: '2',
    userId: '4',
    message: 'Attendance for Mathematics class 10A has been submitted',
    read: true,
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
    type: 'success'
  },
  {
    id: '3',
    userId: '6',
    message: 'Monthly attendance report is ready for review',
    read: false,
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    type: 'info'
  }
];

// Function to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Function to get a student by ID
export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

// Function to get a teacher by ID
export const getTeacherById = (id: string): Teacher | undefined => {
  return teachers.find(teacher => teacher.id === id);
};

// Function to get a class by ID
export const getClassById = (id: string): Class | undefined => {
  return classes.find(cls => cls.id === id);
};

// Function to get attendance records for a class
export const getAttendanceRecordsByClass = (classId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.classId === classId);
};

// Function to get attendance records for a student
export const getAttendanceRecordsByStudent = (studentId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => 
    record.entries.some(entry => entry.studentId === studentId)
  );
};

// Function to calculate attendance summary for a student
export const getAttendanceSummaryForStudent = (studentId: string) => {
  const records = getAttendanceRecordsByStudent(studentId);
  const total = records.length;
  
  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;
  
  records.forEach(record => {
    const entry = record.entries.find(e => e.studentId === studentId);
    if (entry) {
      switch (entry.status) {
        case 'present':
          present++;
          break;
        case 'absent':
          absent++;
          break;
        case 'late':
          late++;
          break;
        case 'excused':
          excused++;
          break;
      }
    }
  });
  
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  
  return {
    studentId,
    totalClasses: total,
    present,
    absent,
    late,
    excused,
    percentage
  };
};