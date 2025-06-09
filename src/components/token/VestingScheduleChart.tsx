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
        label: 'Public Round',
        data: publicRoundData,
        borderColor: '#06B6D4', // turquoise
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
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
        label: 'Private Round',
        data: privateRoundData,
        borderColor: '#0F4C3A', // forest
        backgroundColor: 'rgba(15, 76, 58, 0.1)',
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
      
      <div className="mt-6">
        <h4 className="font-bold text-forest mb-3">Vesting Schedule Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Public Round Card */}
          <div className="bg-white border border-forest/20 rounded-lg shadow-sm hover:shadow transition-all p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-[#06B6D4] mr-2"></div>
              <h5 className="font-bold text-forest">Public Round</h5>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-full bg-[#06B6D4] h-2 rounded-full"></div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate">Cliff:</span>
                <span className="font-medium">None</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate">Linear Unlock:</span>
                <span className="font-medium">3 months</span>
              </div>
            </div>
          </div>
          
          {/* Whitelist Round Card */}
          <div className="bg-white border border-forest/20 rounded-lg shadow-sm hover:shadow transition-all p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-[#4ADE80] mr-2"></div>
              <h5 className="font-bold text-forest">Whitelist Round</h5>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-full h-2 rounded-full overflow-hidden flex">
                <div className="bg-gray-300 h-full" style={{ width: '12.5%' }}></div>
                <div className="bg-[#4ADE80] h-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate">Cliff:</span>
                <span className="font-medium">1 month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate">Linear Unlock:</span>
                <span className="font-medium">6 months</span>
              </div>
            </div>
          </div>
          
          {/* Private Round Card */}
          <div className="bg-white border border-forest/20 rounded-lg shadow-sm hover:shadow transition-all p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-[#0F4C3A] mr-2"></div>
              <h5 className="font-bold text-forest">Private Round</h5>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-full h-2 rounded-full overflow-hidden flex">
                <div className="bg-gray-300 h-full" style={{ width: '25%' }}></div>
                <div className="bg-[#0F4C3A] h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate">Cliff:</span>
                <span className="font-medium">2 months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate">Linear Unlock:</span>
                <span className="font-medium">6 months</span>
              </div>
            </div>
          </div>
          
          {/* Team/Founders Card */}
          <div className="bg-white border border-forest/20 rounded-lg shadow-sm hover:shadow transition-all p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-[#2563EB] mr-2"></div>
              <h5 className="font-bold text-forest">Team/Founders</h5>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-full h-2 rounded-full overflow-hidden flex">
                <div className="bg-gray-300 h-full" style={{ width: '23%' }}></div>
                <div className="bg-[#2563EB] h-full" style={{ width: '77%' }}></div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate">Cliff:</span>
                <span className="font-medium">3 months</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate">Linear Unlock:</span>
                <span className="font-medium">10 months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VestingScheduleChart;
