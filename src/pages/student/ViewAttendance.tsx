import React, { useState } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';
import AttendanceStatus from '../../components/attendance/AttendanceStatus';
import AttendanceChart from '../../components/dashboard/AttendanceChart';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAttendanceRecordsByStudent, 
  getAttendanceSummaryForStudent,
  getClassById,
} from '../../data/mockData';
import { FileText, Download } from 'lucide-react';

const ViewAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState(new Date());
  
  if (!currentUser || currentUser.role !== 'student') {
    return <div>Access denied. Please log in as a student.</div>;
  }
  
  const studentId = currentUser.id;
  
  // Get attendance records for the student
  const attendanceRecords = getAttendanceRecordsByStudent(studentId);
  
  // Filter records by date range
  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= fromDate && recordDate <= toDate;
  });
  
  // Get attendance summary
  const summary = getAttendanceSummaryForStudent(studentId);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  // Group records by month
  const groupedByMonth: Record<string, typeof filteredRecords> = {};
  
  filteredRecords.forEach(record => {
    const month = format(new Date(record.date), 'MMMM yyyy');
    if (!groupedByMonth[month]) {
      groupedByMonth[month] = [];
    }
    groupedByMonth[month].push(record);
  });
  
  // Generate monthly reports
  const monthlyReports = Object.keys(groupedByMonth).map(month => {
    const records = groupedByMonth[month];
    
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
    
    const total = present + absent + late + excused;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return {
      month,
      present,
      absent,
      late,
      excused,
      total,
      percentage
    };
  });

  return (
    <DashboardLayout title="View Attendance">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Attendance Records</h2>
            <p className="text-gray-500">View and analyze your attendance history</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
            <DatePicker
              value={fromDate}
              onChange={setFromDate}
              label="From Date"
            />
            
            <DatePicker
              value={toDate}
              onChange={setToDate}
              label="To Date"
            />
            
            <Button variant="outline" className="mt-6 md:mt-0" leftIcon={<Download size={16} />}>
              Export Report
            </Button>
          </div>
        </div>
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
            title="Overall Attendance Summary"
          />
        </div>
        
        <div>
          <Card title="Attendance Statistics" className="h-full">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-xl font-semibold">{summary.totalClasses}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-xl font-semibold">{summary.percentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      summary.percentage >= 90 ? 'bg-green-600' :
                      summary.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${summary.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Present</p>
                    <p className="text-lg font-medium text-green-600">{summary.present}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Absent</p>
                    <p className="text-lg font-medium text-red-600">{summary.absent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Late</p>
                    <p className="text-lg font-medium text-amber-600">{summary.late}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Excused</p>
                    <p className="text-lg font-medium text-sky-600">{summary.excused}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mb-8">
        <Card title="Monthly Reports">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyReports.map((report) => (
                  <tr key={report.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.month}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{report.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">{report.present}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">{report.absent}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-amber-600">{report.late}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          report.percentage >= 90 ? 'bg-green-500' :
                          report.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-sm font-medium">{report.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {monthlyReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      <div>
        <Card title="Detailed Attendance Records">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => {
                  const entry = record.entries.find(e => e.studentId === studentId);
                  const cls = getClassById(record.classId);
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDate(record.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {cls ? `${cls.name} (${cls.section})` : 'Unknown Class'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry ? <AttendanceStatus status={entry.status} /> : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{entry?.notes || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="outline" size="sm" leftIcon={<FileText size={16} />}>
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ViewAttendance;