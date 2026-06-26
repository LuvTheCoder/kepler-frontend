import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function WorkoutCalendar({ completedDates = [], onToggleDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getFormattedDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const getFirstDayOfMonth = () => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const generateDays = () => {
    const dayCells = [];
    const firstDayIndex = getFirstDayOfMonth();
    
    const localToday = new Date();
    const todayStr = getFormattedDateString(localToday.getFullYear(), localToday.getMonth(), localToday.getDate());

    // Previous Month Padding Days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYearIdx = month === 0 ? year - 1 : year;
      const dateStr = getFormattedDateString(prevYearIdx, prevMonthIdx, prevDay);
      
      dayCells.push({
        dayNumber: prevDay,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        completed: completedDates.includes(dateStr)
      });
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = getFormattedDateString(year, month, i);
      dayCells.push({
        dayNumber: i,
        dateString: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        completed: completedDates.includes(dateStr)
      });
    }

    // Next Month Padding Days
    const totalCells = dayCells.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYearIdx = month === 11 ? year + 1 : year;
      const dateStr = getFormattedDateString(nextYearIdx, nextMonthIdx, i);
      
      dayCells.push({
        dayNumber: i,
        dateString: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        completed: completedDates.includes(dateStr)
      });
    }

    return dayCells;
  };

  const days = generateDays();
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md p-5 flex flex-col gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none w-full max-w-[340px] select-none mx-auto">
      
      {/* Header Controls */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15px] font-bold text-black dark:text-white tracking-tight">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center bg-black/[0.04] dark:bg-white/[0.06] p-0.5">
          <button 
            type="button"
            className="flex items-center justify-center w-7 h-7 text-black/60 dark:text-white/77 hover:bg-white dark:hover:bg-white/[0.1] active:scale-95 transition-all" 
            onClick={handlePrevMonth} 
            title="Previous Month"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            className="flex items-center justify-center w-7 h-7 text-black/60 dark:text-white/77 hover:bg-white dark:hover:bg-white/[0.1] active:scale-95 transition-all" 
            onClick={handleNextMonth} 
            title="Next Month"
          >
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Weekday Strip */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold tracking-wide text-black/30 dark:text-white/30 uppercase">
        {dayNames.map((name, i) => (
          <div key={i} className="w-full py-1">{name}</div>
        ))}
      </div>

      {/* Calendar Matrix Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const isDisabled = !day.isToday;
          const isCompleted = day.completed;
          const isTodayCompleted = day.isToday && isCompleted;

          return (
            <button
              key={idx}
              className={`aspect-square flex flex-col items-center justify-center text-[13px] font-semibold transition-all duration-200 w-9 h-9 mx-auto focus:outline-none relative
                ${!day.isCurrentMonth ? 'text-black/20 dark:text-white/15 pointer-events-none' : 'text-black dark:text-white'}
                ${day.isToday && !isCompleted ? 'border-2 border-[#30d158] dark:border-[#30d158] text-[#30d158] dark:text-[#30d158] font-bold shadow-sm' : ''}
                ${isCompleted && !day.isToday ? 'bg-[#34c759]/10 text-[#34c759] dark:text-[#30d158] font-bold' : ''}
                ${isTodayCompleted ? 'bg-[#34c759] dark:bg-[#30d158] text-white font-bold' : ''}
                ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.08] active:scale-90'}
              `}
              onClick={() => { if (!isDisabled) onToggleDate(day.dateString); }}
              disabled={isDisabled}
              title={day.isToday ? "Toggle today's workout" : `${day.dateString}`}
            >
              <span>{day.dayNumber}</span>
              {/* Optional tiny square indicator under completed items */}
              {isCompleted && !isTodayCompleted && (
                <span className="w-1 h-1 bg-[#34c759] dark:bg-[#30d158] absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fitness Banner Footer */}
      <div className="text-[11px] font-semibold text-black/40 dark:text-white/40 flex items-center gap-1.5 justify-center border-t border-black/[0.03] dark:border-white/[0.05] pt-3 mt-1">
        <Check size={12} strokeWidth={2.5} className="text-[#34c759] dark:text-[#30d158]" />
        <span>Tap today's date to log your workout.</span>
      </div>

    </div>
  );
}