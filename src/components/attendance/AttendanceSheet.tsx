import React, { useState } from 'react';
import { Check, X, Clock, Edit } from 'lucide-react';
import Avatar from '../common/Avatar';
import { Student, AttendanceEntry } from '../../types';
import Button from '../common/Button';

interface AttendanceSheetProps {
  students: Student[];
  date: string;
  existingRecords?: AttendanceEntry[];
  onSave: (entries: AttendanceEntry[]) => void;
  isSubmitting?: boolean;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  students,
  date,
  existingRecords = [],
  onSave,
  isSubmitting = false,
}) => {
  const [entries, setEntries] = useState<AttendanceEntry[]>(() => {
    // Initialize with existing records or default (present) for each student
    return students.map(student => {
      const existingEntry = existingRecords.find(e => e.studentId === student.id);
      return existingEntry || {
        studentId: student.id,
        status: 'present' as const,
        notes: ''
      };
    });
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const initialNotes: Record<string, string> = {};
    existingRecords.forEach(record => {
      if (record.notes) {
        initialNotes[record.studentId] = record.notes;
      }
    });
    return initialNotes;
  });

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setEntries(prev => 
      prev.map(entry => 
        entry.studentId === studentId 
          ? { ...entry, status } 
          : entry
      )
    );
  };

  const handleNotesChange = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }));
    
    setEntries(prev => 
      prev.map(entry => 
        entry.studentId === studentId 
          ? { ...entry, notes: note } 
          : entry
      )
    );
  };

  const handleSubmit = () => {
    onSave(entries);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Sheet - {date}</h3>
        <p className="text-sm text-gray-600">Mark attendance for each student</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const entry = entries.find(e => e.studentId === student.id)!;
              
              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Avatar 
                          src={student.avatar}
                          alt={student.name}
                          size="sm"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`p-2 rounded-md ${
                          entry.status === 'present'
                            ? 'bg-green-100 text-green-800 ring-2 ring-green-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                        }`}
                        title="Present"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`p-2 rounded-md ${
                          entry.status === 'absent'
                            ? 'bg-red-100 text-red-800 ring-2 ring-red-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                        title="Absent"
                      >
                        <X size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`p-2 rounded-md ${
                          entry.status === 'late'
                            ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                        }`}
                        title="Late"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        className={`p-2 rounded-md ${
                          entry.status === 'excused'
                            ? 'bg-sky-100 text-sky-800 ring-2 ring-sky-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-sky-50'
                        }`}
                        title="Excused"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Add notes (optional)"
                      value={entry.notes || ''}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 flex justify-end">
        <Button 
          onClick={handleSubmit} 
          variant="primary" 
          isLoading={isSubmitting}
        >
          Save Attendance
        </Button>
      </div>
    </div>
  );
};

export default AttendanceSheet;