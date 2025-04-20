import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import DatePicker from '../../components/common/DatePicker';
import AttendanceSheet from '../../components/attendance/AttendanceSheet';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getClassById, 
  students, 
  getAttendanceRecordsByClass, 
  attendanceRecords
} from '../../data/mockData';
import { AttendanceEntry } from '../../types';

const MarkAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const { classId } = useParams<{ classId: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  if (!currentUser || currentUser.role !== 'teacher') {
    return <div>Access denied. Please log in as a teacher.</div>;
  }
  
  if (!classId) {
    return <div>Class ID is required.</div>;
  }
  
  const classData = getClassById(classId);
  
  if (!classData) {
    return <div>Class not found.</div>;
  }
  
  // Check if the teacher is assigned to this class
  if (classData.teacherId !== currentUser.id) {
    return <div>You do not have permission to mark attendance for this class.</div>;
  }
  
  // Get students for this class
  const classStudents = students.filter(student => 
    classData.students.includes(student.id)
  );
  
  // Get existing attendance records for this class on the selected date
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const existingRecord = attendanceRecords.find(
    record => record.classId === classId && record.date === dateString
  );
  
  // Handle saving attendance
  const handleSaveAttendance = (entries: AttendanceEntry[]) => {
    setIsSubmitting(true);
    
    // In a real app, this would make an API call
    // For demo, simulate API call with a timeout
    setTimeout(() => {
      // If record exists, we're updating it, otherwise creating a new one
      if (existingRecord) {
        // Simulate updating an existing record
        console.log('Updating attendance record:', { date: dateString, entries });
      } else {
        // Simulate creating a new record
        console.log('Creating new attendance record:', { date: dateString, entries });
      }
      
      setIsSubmitting(false);
      setSuccessMessage('Attendance saved successfully!');
    }, 1000);
  };

  return (
    <DashboardLayout title="Mark Attendance">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-2">{classData.name} ({classData.section})</h2>
            <p className="text-gray-500">Mark attendance for this class</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              label="Attendance Date"
            />
            
            <Button
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {classStudents.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No students found for this class.</p>
          </div>
        </Card>
      ) : (
        <AttendanceSheet
          students={classStudents}
          date={format(selectedDate, 'MMMM dd, yyyy')}
          existingRecords={existingRecord?.entries || []}
          onSave={handleSaveAttendance}
          isSubmitting={isSubmitting}
        />
      )}
      
      <div className="mt-8">
        <Card title="Attendance History">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excused</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getAttendanceRecordsByClass(classId).map((record) => {
                  const present = record.entries.filter(e => e.status === 'present').length;
                  const absent = record.entries.filter(e => e.status === 'absent').length;
                  const late = record.entries.filter(e => e.status === 'late').length;
                  const excused = record.entries.filter(e => e.status === 'excused').length;
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">{present}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 font-medium">{absent}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-600 font-medium">{late}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-sky-600 font-medium">{excused}</div>
                      </td>
                    </tr>
                  );
                })}
                
                {getAttendanceRecordsByClass(classId).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No attendance records found for this class.
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

export default MarkAttendance;