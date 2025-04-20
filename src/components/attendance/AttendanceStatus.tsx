import React from 'react';
import Badge from '../common/Badge';

interface AttendanceStatusProps {
  status: 'present' | 'absent' | 'late' | 'excused';
  showLabel?: boolean;
}

const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ status, showLabel = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return { variant: 'success', icon: '✓', label: 'Present' };
      case 'absent':
        return { variant: 'danger', icon: '✗', label: 'Absent' };
      case 'late':
        return { variant: 'warning', icon: '⏱', label: 'Late' };
      case 'excused':
        return { variant: 'info', icon: '✎', label: 'Excused' };
      default:
        return { variant: 'secondary', icon: '?', label: 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      <span>{config.icon}</span>
      {showLabel && <span className="ml-1">{config.label}</span>}
    </Badge>
  );
};

export default AttendanceStatus;