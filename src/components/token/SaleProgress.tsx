import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SaleProgress: React.FC = () => {
  // Current whitelist round data
  const goalAmount = 75; // ETH
  const raisedAmount = 42; // ETH (example value)
  const progressPercentage = Math.round((raisedAmount / goalAmount) * 100);
  const remainingAmount = goalAmount - raisedAmount;
  
  // Doughnut chart data
  const chartData = {
    labels: ['Raised', 'Remaining'],
    datasets: [
      {
        data: [raisedAmount, remainingAmount],
        backgroundColor: [
          '#22C55E', // forest-light for raised
          '#E2E8F0', // light gray for remaining
        ],
        borderColor: [
          '#0F4C3A', // forest-dark for raised
          '#CBD5E1', // slightly darker gray for remaining
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(tooltipItem: any) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} ETH`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative">
      {/* Subtle background gradient similar to homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent rounded-lg -z-10"></div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-slate font-medium">Whitelist Round</span>
          <h3 className="text-2xl font-bold text-forest">{raisedAmount} / {goalAmount} ETH</h3>
        </div>
        <div className="bg-forest/10 px-3 py-1 rounded-full">
          <span className="text-forest font-medium">{progressPercentage}% Complete</span>
        </div>
      </div>
      
      <div className="relative h-64 mb-6">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-forest">{raisedAmount} ETH</span>
          <span className="text-sm text-slate">raised so far</span>
          <span className="text-xs text-forest/80 mt-1">{remainingAmount} ETH remaining</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-forest/5 p-3 rounded-lg">
          <span className="text-sm text-slate block">Contributors</span>
          <span className="text-xl font-bold text-forest">127</span>
        </div>
        <div className="bg-forest/5 p-3 rounded-lg">
          <span className="text-sm text-slate block">Avg. Donation</span>
          <span className="text-xl font-bold text-forest">0.33 ETH</span>
        </div>
        <div className="bg-forest/5 p-3 rounded-lg">
          <span className="text-sm text-slate block">Time Remaining</span>
          <span className="text-xl font-bold text-forest">14 days</span>
        </div>
        <div className="bg-forest/5 p-3 rounded-lg">
          <span className="text-sm text-slate block">Tokens Available</span>
          <span className="text-xl font-bold text-forest">83M</span>
        </div>
      </div>
      
      <div className="mt-6">
        <button className="w-full bg-forest hover:bg-forest/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          Contribute Now
        </button>
      </div>
    </div>
  );
};

export default SaleProgress;
