import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const formattedDate = format(value, 'MMM dd, yyyy');

  const handleDateSelect = (date: string) => {
    onChange(new Date(date));
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div 
          className={`flex items-center justify-between px-4 py-2 border rounded-md bg-white cursor-pointer
            ${error ? 'border-red-500' : 'border-gray-300'} 
            hover:border-blue-500`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{formattedDate}</span>
          <Calendar size={20} className="text-gray-500" />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
            <input
              type="date"
              className="sr-only"
              value={format(value, 'yyyy-MM-dd')}
              onChange={(e) => handleDateSelect(e.target.value)}
              onBlur={() => setIsOpen(false)}
            />
            <div className="p-2">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={format(value, 'yyyy-MM-dd')}
                onChange={(e) => handleDateSelect(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;