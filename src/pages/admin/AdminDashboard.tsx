import React, { useState } from 'react';
import { format } from 'date-fns';
import { Users, School, BookOpen, UserCheck, Download, FileText, Settings } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { useAuth } from '../../contexts/AuthContext';
import { 
  students, 
  teachers, 
  classes, 
  attendanceRecords
} from '../../data/mockData';

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Access denied. Please log in as an administrator.</div>;
  }
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };
  
  // Get counts for summary stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  
  // Calculate attendance rates
  const calculateAttendanceRate = () => {
    let totalEntries = 0;
    let presentEntries = 0;
    
    attendanceRecords.forEach(record => {
      record.entries.forEach(entry => {
        totalEntries++;
        if (entry.status === 'present') {
          presentEntries++;
        }
      });
    });
    
    return totalEntries > 0 ? Math.round((presentEntries / totalEntries) * 100) : 0;
  };
  
  const attendanceRate = calculateAttendanceRate();
  
  // Get recent attendance records
  const recentAttendance = [...attendanceRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get classes with attendance data
  const classesWithAttendance = classes.map(cls => {
    const classRecords = attendanceRecords.filter(record => record.classId === cls.id);
    const totalSessions = classRecords.length;
    
    let totalPresent = 0;
    let totalEntries = 0;
    
    classRecords.forEach(record => {
      record.entries.forEach(entry => {
        totalEntries++;
        if (entry.status === 'present') {
          totalPresent++;
        }
      });
    });
    
    const attendanceRate = totalEntries > 0 ? Math.round((totalPresent / totalEntries) * 100) : 0;
    
    return {
      ...cls,
      attendanceRate,
      totalSessions
    };
  });

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <p className="text-gray-500">Welcome, Administrator</p>
          <h2 className="text-xl font-semibold mt-1">Today: {formatDate(new Date())}</h2>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant={selectedTimeframe === 'day' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedTimeframe('day')}
          >
            Today
          </Button>
          <Button 
            variant={selectedTimeframe === 'week' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedTimeframe('week')}
          >
            This Week
          </Button>
          <Button 
            variant={selectedTimeframe === 'month' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setSelectedTimeframe('month')}
          >
            This Month
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={<Users size={24} />}
          color="blue"
          description="Total number of students enrolled"
        />
        
        <StatsCard
          title="Total Teachers"
          value={totalTeachers}
          icon={<School size={24} />}
          color="green"
          description="Total number of teachers registered"
        />
        
        <StatsCard
          title="Total Classes"
          value={totalClasses}
          icon={<BookOpen size={24} />}
          color="amber"
          description="Total number of active classes"
        />
        
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<UserCheck size={24} />}
          color="blue"
          description="Average attendance across all classes"
          trend={{ value: 2, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card title="Class Attendance Overview">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classesWithAttendance.map((cls) => (
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
                        <div className="relative w-full bg-gray-200 rounded h-1.5">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded ${
                              cls.attendanceRate >= 90 ? 'bg-green-500' : 
                              cls.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${cls.attendanceRate}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{cls.attendanceRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="outline" size="sm">
                          <FileText size={16} className="mr-1" />
                          Details
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
          <Card title="Quick Actions" className="h-full">
            <div className="space-y-4">
              <Button variant="primary" fullWidth leftIcon={<Users size={20} />}>
                Manage Users
              </Button>
              <Button variant="outline" fullWidth leftIcon={<BookOpen size={20} />}>
                Manage Classes
              </Button>
              <Button variant="outline" fullWidth leftIcon={<FileText size={20} />}>
                Generate Reports
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Download size={20} />}>
                Export Data
              </Button>
              <Button variant="outline" fullWidth leftIcon={<Settings size={20} />}>
                System Settings
              </Button>
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
                header: 'Teacher',
                accessor: (record) => {
                  const cls = classes.find(c => c.id === record.classId);
                  const teacher = teachers.find(t => t.id === cls?.teacherId);
                  return teacher ? teacher.name : 'Unknown Teacher';
                },
              },
              {
                header: 'Attendance Rate',
                accessor: (record) => {
                  const presentCount = record.entries.filter(e => e.status === 'present').length;
                  const totalCount = record.entries.length;
                  const rate = Math.round((presentCount / totalCount) * 100);
                  return (
                    <div>
                      <div className="relative w-full bg-gray-200 rounded h-1.5">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded ${
                            rate >= 90 ? 'bg-green-500' : 
                            rate >= 75 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{rate}% ({presentCount}/{totalCount})</div>
                    </div>
                  );
                },
              },
              {
                header: 'Actions',
                accessor: () => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download size={16} />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={recentAttendance}
            keyExtractor={(record) => record.id}
            emptyMessage="No attendance records found"
          />
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" leftIcon={<Download size={20} />}>
              Export All Data
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;