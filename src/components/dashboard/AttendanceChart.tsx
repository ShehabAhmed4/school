import React from 'react';
import Card from '../common/Card';

interface AttendanceChartProps {
  data: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  title?: string;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({
  data,
  title = 'Attendance Overview',
}) => {
  const total = data.present + data.absent + data.late + data.excused;
  
  if (total === 0) {
    return (
      <Card title={title} className="h-full">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">No attendance data available</p>
        </div>
      </Card>
    );
  }
  
  const calculateWidth = (value: number) => {
    return `${Math.round((value / total) * 100)}%`;
  };

  const presentWidth = calculateWidth(data.present);
  const absentWidth = calculateWidth(data.absent);
  const lateWidth = calculateWidth(data.late);
  const excusedWidth = calculateWidth(data.excused);
  
  const presentPercentage = Math.round((data.present / total) * 100);
  const absentPercentage = Math.round((data.absent / total) * 100);
  const latePercentage = Math.round((data.late / total) * 100);
  const excusedPercentage = Math.round((data.excused / total) * 100);

  return (
    <Card title={title} className="h-full">
      <div className="mt-4">
        <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="flex h-full">
            <div className="bg-green-500 h-full" style={{ width: presentWidth }}></div>
            <div className="bg-red-500 h-full" style={{ width: absentWidth }}></div>
            <div className="bg-amber-500 h-full" style={{ width: lateWidth }}></div>
            <div className="bg-sky-500 h-full" style={{ width: excusedWidth }}></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <p className="font-medium mt-1">{presentPercentage}% ({data.present})</p>
          </div>
          
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <p className="font-medium mt-1">{absentPercentage}% ({data.absent})</p>
          </div>
          
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
            <p className="font-medium mt-1">{latePercentage}% ({data.late})</p>
          </div>
          
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
              <span className="text-sm text-gray-600">Excused</span>
            </div>
            <p className="font-medium mt-1">{excusedPercentage}% ({data.excused})</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceChart;