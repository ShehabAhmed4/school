import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Calendar, Clock, User, Bell, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import AttendanceStatus from '../../components/attendance/AttendanceStatus';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAttendanceRecordsByStudent, 
  getAttendanceSummaryForStudent,
  getClassById,
  notifications
} from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate] = useState(new Date());
  
  if (!currentUser || currentUser.role !== 'student') {
    return <div>Access denied. Please log in as a student.</div>;
  }
  
  const studentId = currentUser.id;
  
  // Get attendance records for the student
  const attendanceRecords = getAttendanceRecordsByStudent(studentId);
  
  // Get attendance summary
  const summary = getAttendanceSummaryForStudent(studentId);
  
  // Calculate attendance percentage
  const attendancePercentage = summary.percentage;
  
  // Filter notifications for the student
  const studentNotifications = notifications
    .filter(notification => notification.userId === studentId)
    .slice(0, 5);
  
  // Get recent attendance records
  const recentAttendance = attendanceRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  // Calculate upcoming classes (mock data for demo)
  const upcomingClasses = [
    { 
      id: '1',
      name: 'Mathematics',
      time: `${format(subDays(new Date(), -1), 'EEEE')} 09:00 - 10:00`,
      teacher: 'Jessica Brown'
    },
    { 
      id: '2',
      name: 'English',
      time: `${format(subDays(new Date(), -1), 'EEEE')} 11:00 - 12:00`,
      teacher: 'David Miller'
    },
    { 
      id: '3',
      name: 'Physics',
      time: `${format(subDays(new Date(), -2), 'EEEE')} 09:00 - 10:00`,
      teacher: 'Jessica Brown'
    }
  ];

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Attendance Rate"
          value={`${attendancePercentage}%`}
          icon={<User size={24} />}
          color="blue"
          description="Your overall attendance percentage across all classes"
        />
        
        <StatsCard
          title="Classes Today"
          value={upcomingClasses.length}
          icon={<Calendar size={24} />}
          color="green"
          description="Number of scheduled classes for today"
        />
        
        <StatsCard
          title="Last Absence"
          value={summary.absent > 0 ? formatDate(recentAttendance.find(r => 
            r.entries.find(e => e.studentId === studentId && e.status === 'absent')
          )?.date || '') : 'None'}
          icon={<AlertCircle size={24} />}
          color="red"
          description={summary.absent > 0 ? 'Your most recent absence from class' : 'You have no absences recorded'}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AttendanceChart
            data={{
              present: summary.present,
              absent: summary.absent,
              late: summary.late,
              excused: summary.excused
            }}
            title="Attendance Overview"
          />
        </div>
        
        <div>
          <Card title="Upcoming Classes" className="h-full">
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{cls.name}</h4>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Teacher: {cls.teacher}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Attendance">
          <Table
            columns={[
              {
                header: 'Date',
                accessor: (record) => formatDate(record.date),
              },
              {
                header: 'Class',
                accessor: (record) => {
                  const cls = getClassById(record.classId);
                  return cls ? `${cls.name} (${cls.section})` : 'Unknown Class';
                },
              },
              {
                header: 'Status',
                accessor: (record) => {
                  const entry = record.entries.find(e => e.studentId === studentId);
                  return entry ? <AttendanceStatus status={entry.status} /> : 'N/A';
                },
              },
              {
                header: 'Notes',
                accessor: (record) => {
                  const entry = record.entries.find(e => e.studentId === studentId);
                  return entry?.notes || '-';
                },
              },
            ]}
            data={recentAttendance}
            keyExtractor={(record) => record.id}
            emptyMessage="No attendance records found"
          />
        </Card>
        
        <Card title="Recent Notifications">
          <div className="space-y-4">
            {studentNotifications.length > 0 ? (
              studentNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-md ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Bell size={16} className={!notification.read ? 'text-blue-500' : 'text-gray-400'} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">{notification.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;