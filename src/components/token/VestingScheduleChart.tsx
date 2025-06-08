import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VestingScheduleChart: React.FC = () => {
  // Months for the x-axis (0-27 months)
  const months = [
    'TGE', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 
    'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12',
    'Month 13'
  ];

  // Cumulative vesting percentages for each round
  // Private Round: 2-month cliff, then 6-month linear unlock
  const privateRoundData = [
    0, 0, 0, 16.67, 33.34, 50.01, 66.68, 83.35, 100
  ];
  
  // Whitelist Round: 1-month cliff, then 6-month linear unlock
  const whitelistRoundData = [
    0, 0, 16.67, 33.34, 50.01, 66.68, 83.35, 100
  ];
  
  // Public Round: No cliff, 3-month linear unlock
  const publicRoundData = [
    0, 33.33, 66.67, 100
  ];
  
  // Team: 3-month cliff, then 10-month linear unlock (from month 3 to month 13)
  const teamRoundData = [
    0, 0, 0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
  ];
  

  // Chart data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Private Round',
        data: privateRoundData,
        borderColor: '#0F4C3A', // forest
        backgroundColor: 'rgba(15, 76, 58, 0.1)',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Whitelist Round',
        data: whitelistRoundData,
        borderColor: '#4ADE80', // electric
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Public Round',
        data: publicRoundData,
        borderColor: '#06B6D4', // turquoise
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Team',
        data: teamRoundData,
        borderColor: '#2563EB', // blue
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0,
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Token Unlock %',
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'line'>) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}% unlocked`;
          }
        }
      }
    },
  };

  return (
    <div>
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="bg-forest/5 p-3 rounded-lg">
          <h4 className="font-bold text-forest mb-2">Vesting Schedule Summary</h4>
          <ul className="list-disc list-inside text-sm text-slate">
            <li><span className="font-medium">Private Round:</span> 2-month cliff, then 6-month linear unlock</li>
            <li><span className="font-medium">Whitelist Round:</span> 1-month cliff, then 6-month linear unlock</li>
            <li><span className="font-medium">Public Round:</span> No cliff, 3-month linear unlock</li>
            <li><span className="font-medium">Team/Founders:</span> 3-month cliff, then 10-month linear unlock</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VestingScheduleChart;
