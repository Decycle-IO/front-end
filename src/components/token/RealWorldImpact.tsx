import React from 'react';
import Card from '../ui/Card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const RealWorldImpact: React.FC = () => {
  // Impact statistics (example data)
  const impactStats = {
    treesPlanted: 12500,
    oceanPlasticRemoved: 8750, // kg
    wildlifeProtected: 35, // species
    carbonOffset: 125, // tons
  };

  // Impact distribution chart data
  const chartData = {
    labels: ['Reforestation', 'Ocean Cleanup', 'Wildlife Conservation', 'Carbon Offset'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          '#4ADE80', // electric
          '#06B6D4', // turquoise
          '#2563EB', // blue
          '#0F4C3A', // forest
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Impact initiatives
  const initiatives = [
    {
      title: 'Tree Planting Partners',
      description: 'We work with global reforestation organizations to plant trees in areas affected by deforestation.',
      icon: '🌱',
    },
    {
      title: 'Ocean Cleanup',
      description: 'Our partners remove plastic waste from oceans and waterways to protect marine ecosystems.',
      icon: '🌊',
    },
    {
      title: 'Wildlife Protection',
      description: 'We support conservation efforts for endangered species featured in our Eco-Guardians collection.',
      icon: '🐘',
    },
    {
      title: 'Carbon Offset Projects',
      description: 'A portion of donations funds renewable energy and carbon capture initiatives.',
      icon: '♻️',
    },
  ];

  return (
    <div>
      <p className="text-lg text-slate mb-8">
        When you donate and receive $TRASH tokens, you're directly contributing to real environmental initiatives.
        A portion of all donations is allocated to our impact partners.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <h3 className="text-xl font-bold text-forest mb-4">Impact Distribution</h3>
            <div className="h-64 relative">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-sm text-slate">Total Impact</span>
                <span className="text-2xl font-bold text-forest">$175,000</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="text-xl font-bold text-forest mb-4">Environmental Impact Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-forest/5 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌳</div>
                <span className="block text-2xl font-bold text-forest">{impactStats.treesPlanted.toLocaleString()}</span>
                <span className="text-sm text-slate">Trees Planted</span>
              </div>
              
              <div className="bg-forest/5 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌊</div>
                <span className="block text-2xl font-bold text-forest">{impactStats.oceanPlasticRemoved.toLocaleString()} kg</span>
                <span className="text-sm text-slate">Ocean Plastic Removed</span>
              </div>
              
              <div className="bg-forest/5 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🦁</div>
                <span className="block text-2xl font-bold text-forest">{impactStats.wildlifeProtected}</span>
                <span className="text-sm text-slate">Species Protected</span>
              </div>
              
              <div className="bg-forest/5 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">♻️</div>
                <span className="block text-2xl font-bold text-forest">{impactStats.carbonOffset.toLocaleString()} tons</span>
                <span className="text-sm text-slate">Carbon Offset</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initiatives.map((initiative, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start">
              <div className="text-3xl mr-4">{initiative.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-forest mb-2">{initiative.title}</h3>
                <p className="text-slate">{initiative.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 bg-electric/10 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-forest mb-2">Transparency Commitment</h3>
        <p className="text-slate">
          We're committed to full transparency in our environmental impact. Quarterly reports are published 
          detailing all donations made to our partners and the measurable impact achieved. All transactions 
          are recorded on-chain for verification.
        </p>
      </div>
    </div>
  );
};

export default RealWorldImpact;
