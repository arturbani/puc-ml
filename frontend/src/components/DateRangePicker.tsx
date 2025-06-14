import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3 text-gray-800">
        Selecione o período da análise da Gasolina
      </h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Data inicial
          </label>
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={onStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholderText="DD/MM/AAAA"
            />
            <Calendar className="absolute top-3 right-3 text-gray-400" size={20} />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            Data final
          </label>
          <div className="relative">
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={onEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              placeholderText="DD/MM/AAAA"
            />
            <Calendar className="absolute top-3 right-3 text-gray-400" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;