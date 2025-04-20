import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Clock, Bell, BarChart2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
import DatePicker from '../../components/common/DatePicker';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getTeacherById, 
  classes,
  getAttendanceRecordsByClass,
  students,
  notifications
} from '../../data/mockData';

const TeacherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  
  if (!currentUser || currentUser.role !== 'teacher') {
    return <div>Access denied. Please log in as a teacher.</div>;
  }
  
  const teacherId = currentUser.id;
  const teacher = getTeacherById(teacherId);
  
  if (!teacher) {
    return <div>Teacher information not found.</div>;
  }
  
  // Get classes taught by this teacher
  const teacherClasses = classes.filter(cls => cls.teacherId === teacherId);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };
  
  // Get all students in teacher's classes
  const teacherStudents = students.filter(student => 
    teacherClasses.some(cls => cls.students.includes(student.id))
  );
  
  // Filter notifications for the teacher
  const teacherNotifications = notifications
    .filter(notification => notification.userId === teacherId)
    .slice(0, 5);
  
  // Calculate attendance summary for all classes
  const totalClasses = teacherClasses.length;
  const totalStudents = teacherStudents.length;
  
  // Get attendance records for all classes
  const allClassesAttendanceRecords = teacherClasses.flatMap(cls => 
    getAttendanceRecordsByClass(cls.id)
  );
  
  // Sort by date (most recent first)
  const recentAttendanceRecords = [...allClassesAttendanceRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate attendance stats
  const calculateAttendanceStats = () => {
    if (allClassesAttendanceRecords.length === 0) return { present: 0, absent: 0, late: 0, excused: 0 };
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    
    allClassesAttendanceRecords.forEach(record => {
      record.entries.forEach(entry => {
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
      });
    });
    
    return { present, absent, late, excused };
  };
  
  const attendanceStats = calculateAttendanceStats();

  return (
    <DashboardLayout title="Teacher Dashboard">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <p className="text-gray-500">Welcome back, {teacher.name}</p>
          <h2 className="text-xl font-semibold mt-1">Today: {formatDate(new Date())}</h2>
        </div>
        
        <div className="mt-4 md:mt-0">
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            label="Select Date"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Classes"
          value={totalClasses}
          icon={<Calendar size={24} />}
          color="blue"
          description="Number of classes you are teaching"
        />
        
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={<Users size={24} />}
          color="green"
          description="Number of students across all your classes"
        />
        
        <StatsCard
          title="Present Today"
          value={attendanceStats.present}
          icon={<Clock size={24} />}
          color="amber"
          description="Students present across all classes today"
        />
        
        <StatsCard
          title="Absent Today"
          value={attendanceStats.absent}
          icon={<Bell size={24} />}
          color="red"
          description="Students absent across all classes today"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card title="Your Classes">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teacherClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{cls.section}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{cls.students.length}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/teacher/attendance/${cls.id}`)}
                        >
                          Mark Attendance
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Recent Notifications" className="h-full">
            <div className="space-y-4">
              {teacherNotifications.length > 0 ? (
                teacherNotifications.map((notification) => (
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
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card title="Recent Attendance Records">
          <Table
            columns={[
              {
                header: 'Date',
                accessor: (record) => format(new Date(record.date), 'MMM dd, yyyy'),
              },
              {
                header: 'Class',
                accessor: (record) => {
                  const cls = classes.find(c => c.id === record.classId);
                  return cls ? `${cls.name} (${cls.section})` : 'Unknown Class';
                },
              },
              {
                header: 'Present',
                accessor: (record) => {
                  const presentCount = record.entries.filter(e => e.status === 'present').length;
                  const totalCount = record.entries.length;
                  return `${presentCount}/${totalCount}`;
                },
              },
              {
                header: 'Absent',
                accessor: (record) => {
                  const absentCount = record.entries.filter(e => e.status === 'absent').length;
                  return absentCount;
                },
              },
              {
                header: 'Actions',
                accessor: (record) => (
                  <Link 
                    to={`/teacher/attendance/${record.classId}?date=${record.date}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Button variant="outline" size="sm">
                      <BarChart2 size={16} className="mr-1" />
                      View Details
                    </Button>
                  </Link>
                ),
              },
            ]}
            data={recentAttendanceRecords}
            keyExtractor={(record) => record.id}
            emptyMessage="No attendance records found"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;