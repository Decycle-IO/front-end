import React from 'react';
import Card from '../ui/Card';

const GameUtilitySection: React.FC = () => {
  // Game utility features aligned with ecosystem points
  const utilityFeatures = [
    {
      title: 'Evolving Backyard',
      description: 'Watch your virtual backyard transform as you invest in ecosystem points, with visual changes reflecting your environmental impact.',
      icon: '🏡',
    },
    {
      title: 'Flora Development',
      description: 'Grow your backyard from basic grass to a magical forest as you increase Flora Points, directly funding real-world tree planting initiatives.',
      icon: '🌱',
    },
    {
      title: 'Wildlife Sanctuary',
      description: 'Attract increasingly rare animal species to your backyard as you invest in Fauna Points, supporting actual wildlife conservation efforts.',
      icon: '🦊',
    },
    {
      title: 'Water Features',
      description: 'Develop beautiful water elements from small puddles to complex waterfall systems while funding ocean cleanup through Aqua Points.',
      icon: '💧',
    },
    {
      title: 'Eco-Technology',
      description: 'Add sustainable infrastructure to your sanctuary with Sustainability Points, powering real renewable energy projects worldwide.',
      icon: '♻️',
    },
    {
      title: 'Community Impact',
      description: 'Join global challenges where players collectively increase ecosystem points, creating measurable environmental change together.',
      icon: '🌍',
    },
  ];

  // Ecosystem point categories
  const ecosystemPoints = [
    { 
      category: 'Flora', 
      description: 'Invest in plant life and vegetation',
      impact: 'Funds tree planting & habitat restoration',
      progression: 'Evolves from basic grass to magical forest'
    },
    { 
      category: 'Fauna', 
      description: 'Support animal and insect life',
      impact: 'Supports wildlife conservation efforts',
      progression: 'Attracts increasingly rare animal species'
    },
    { 
      category: 'Aqua', 
      description: 'Develop water features and aquatic health',
      impact: 'Funds ocean cleanup & water conservation',
      progression: 'Develops from puddles to complex water features'
    },
    { 
      category: 'Sustainability', 
      description: 'Build eco-friendly infrastructure',
      impact: 'Funds renewable energy projects',
      progression: 'Adds eco-friendly tech to your sanctuary'
    },
  ];

  return (
    <div>
      <div className="bg-electric/10 p-6 rounded-xl border border-electric/20 mb-8">
        <h3 className="text-xl font-bold text-forest mb-4">Eco Gamification System</h3>
        
        <p className="mb-4 text-slate">
          Spend your $TRASH tokens to increase different ecosystem point categories in your virtual backyard.
          As points increase, your backyard evolves visually while creating real-world environmental impact.
          Every in-game action creates real world action.
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-electric/20">
                <th className="py-2 px-4 text-left text-forest font-bold">Category</th>
                <th className="py-2 px-4 text-left text-forest font-bold">Description</th>
                <th className="py-2 px-4 text-left text-forest font-bold">Real-World Impact</th>
                <th className="py-2 px-4 text-left text-forest font-bold">Visual Progression</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemPoints.map((point, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-forest/5' : ''}>
                  <td className="py-2 px-4 font-medium">{point.category}</td>
                  <td className="py-2 px-4 text-slate">{point.description}</td>
                  <td className="py-2 px-4 text-slate">{point.impact}</td>
                  <td className="py-2 px-4 text-slate">{point.progression}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilityFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" 
            hover
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-forest mb-2">{feature.title}</h3>
            <p className="text-slate flex-grow">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GameUtilitySection;
