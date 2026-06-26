import React from 'react';

export default function MetricCard({ title, value, unit, icon: Icon, footer, accented, children }) {
  // Determine color theme based on title (Apple Fitness Ring colors)
  const getColorScheme = () => {
    switch (title) {
      case 'Current Weight':
        return {
          iconColor: 'text-[#FF2D55]', // Fitness Red/Pink
          bgHover: 'hover:bg-[#FF2D55]/5',
          valueColor: 'text-[#FF2D55]'
        };
      case 'Workout Streak':
        return {
          iconColor: 'text-[#30D158]', // Fitness Green
          bgHover: 'hover:bg-[#30D158]/5',
          valueColor: 'text-[#30D158]'
        };
      case 'Body Mass Index':
        return {
          iconColor: 'text-[#0A84FF]', // Fitness Blue/Cyan
          bgHover: 'hover:bg-[#0A84FF]/5',
          valueColor: 'text-[#0A84FF]'
        };
      case 'Target Status':
        return {
          iconColor: 'text-[#FF9500]', // Fitness Orange
          bgHover: 'hover:bg-[#FF9500]/5',
          valueColor: 'text-[#FF9500]'
        };
      default:
        return {
          iconColor: 'text-black/40 dark:text-white/40',
          bgHover: 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]',
          valueColor: 'text-black dark:text-white'
        };
    }
  };

  const scheme = getColorScheme();

  return (
    <div className={`bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-200 ${scheme.bgHover}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <span className="text-[14px] font-semibold text-black/40 dark:text-white/45 tracking-tight uppercase leading-none">
          {title}
        </span>
        {Icon && (
          <div className={`flex items-center justify-center transition-colors duration-150 ${scheme.iconColor}`}>
            <Icon size={18} strokeWidth={2.4} />
          </div>
        )}
      </div>

      {/* Value Frame */}
      <div className="flex flex-col flex-1 justify-end mt-4">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-extrabold tracking-tight ${scheme.valueColor}`}>
            {value}
          </span>
          {unit && (
            <span className="text-[14px] text-black/40 dark:text-white/40 font-semibold tracking-normal ml-0.5">
              {unit}
            </span>
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="text-[12px] font-semibold text-black/35 dark:text-white/35 mt-1.5 flex items-center gap-1">
            {footer}
          </div>
        )}
      </div>

      {/* Embedded Chart / Layout Canvas */}
      {children && (
        <div className="mt-3 w-full">
          {children}
        </div>
      )}
    </div>
  );
}