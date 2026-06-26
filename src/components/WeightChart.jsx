import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function WeightChart({ logs = [] }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  // Detect dark mode reactively to tweak canvas styles
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const labels = logs.map(log => {
      const date = new Date(log.date);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        timeZone: 'UTC'
      });
    });

    const weights = logs.map(log => log.weight);
    const ctx = chart.ctx;
    
    // Apple Health Tint Profile (System Blue)
    const strokeColor = isDarkMode ? '#0a84ff' : '#0071e3';
    
    // Create soft transparent structural area fill
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height || 300);
    gradient.addColorStop(0, isDarkMode ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 113, 227, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    setChartData({
      labels,
      datasets: [
        {
          fill: true,
          label: 'Weight',
          data: weights,
          borderColor: strokeColor,
          borderWidth: 2.5,
          backgroundColor: gradient,
          tension: 0.35, // Smooth native-feeling curve line
          pointBackgroundColor: strokeColor,
          pointBorderColor: isDarkMode ? '#1c1c1e' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: logs.length === 1 ? 5 : 2, // Visible if only 1 point, matching Apple interactive style
          pointHoverRadius: 6,
          pointHoverBackgroundColor: strokeColor,
          pointHoverBorderColor: isDarkMode ? '#ffffff' : '#ffffff',
          pointHoverBorderWidth: 2,
        },
      ],
    });
  }, [logs, isDarkMode]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#ffffff' : '#000000',
        titleFont: { 
          family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif', 
          size: 11, 
          weight: '600' 
        },
        bodyFont: { 
          family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', 
          size: 14, 
          weight: '700' 
        },
        padding: { px: 12, py: 8 },
        cornerRadius: 0, // Sharp square tooltip box!
        displayColors: false,
        borderWidth: 1,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        shadowColor: 'rgba(0,0,0,0.1)',
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} kg`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          font: { 
            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', 
            size: 11 
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          drawTicks: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          font: { 
            family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif', 
            size: 11 
          },
          padding: 10,
          maxTicksLimit: 5,
        },
        border: { display: false },
      },
    },
  };

  if (logs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-black/40 dark:text-white/40 text-[14px] font-medium tracking-tight">
        No weight records for this period. Add one to see the trend.
      </div>
    );
  }

  return (
    <div className="w-full h-full select-none">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}