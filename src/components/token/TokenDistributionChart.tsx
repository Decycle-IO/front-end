import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TokenDistributionChart: React.FC = () => {
  // Consolidated token distribution data - reduced to 5 categories
  const distributionData = [
    { label: 'Community Sales', percentage: 34.375, color: '#4ADE80' }, // electric - combined Private, Whitelist, Public rounds
    { label: 'Team & Development', percentage: 20, color: '#2563EB' }, // blue
    { label: 'Ecosystem Rewards', percentage: 30, color: '#06B6D4' }, // turquoise
    { label: 'Liquidity Pool', percentage: 12.5, color: '#22D3EE' }, // turquoise-light
    { label: 'Operations & Marketing', percentage: 3.125, color: '#0F4C3A' }, // forest - combined Marketing/Partnerships and Reserve
  ];

  // Prepare chart data
  const chartData = {
    labels: distributionData.map(item => item.label),
    datasets: [
      {
        data: distributionData.map(item => item.percentage),
        backgroundColor: distributionData.map(item => item.color),
        borderColor: distributionData.map(item => item.color),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(tooltipItem: any) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="h-80">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TokenDistributionChart;
