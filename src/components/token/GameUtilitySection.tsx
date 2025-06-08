import React from 'react';
import Card from '../ui/Card';

const GameUtilitySection: React.FC = () => {
  // Ecosystem point categories with enhanced visual elements
  const ecosystemPoints = [
    { 
      category: 'Flora', 
      icon: '🌱',
      description: 'Invest in diverse plant life and vegetation to create\na thriving ecosystem.',
      impact: 'Funds tree planting initiatives and restoration of\nendangered forest habitats around the world.',
      progression: 'Basic grass → Flower patches → Lush gardens → Mini forest → Magical ancient forest',
      color: 'from-forest to-forest-light',
      cost: '20 $TRASH = 1 Point'
    },
    { 
      category: 'Fauna', 
      icon: '🦊',
      description: 'Nurture and protect wildlife in your sanctuary,\nattracting increasingly rare and endangered species.',
      impact: 'Directly supports conservation programs protecting\nendangered species and their natural habitats.',
      progression: 'Butterflies → Small animals → Diverse birds → Deer & predators → Endangered species',
      color: 'from-amber-500 to-orange-600',
      cost: '25 $TRASH = 1 Point'
    },
    { 
      category: 'Aqua', 
      icon: '💧',
      description: 'Create beautiful water features that support\ndiverse aquatic life and enhance your ecosystem.',
      impact: 'Finances ocean cleanup operations and freshwater\nconservation projects in vulnerable regions.',
      progression: 'Small puddles → Pond with fish → Flowing stream → Wetland ecosystem → Waterfall',
      color: 'from-cyan to-blue-500',
      cost: '15 $TRASH = 1 Point'
    },
    { 
      category: 'Sustainability', 
      icon: '♻️',
      description: 'Implement cutting-edge green technology to make\nyour sanctuary self-sustaining and eco-friendly.',
      impact: 'Invests in renewable energy infrastructure and\nsustainable technology in developing communities.',
      progression: 'Recycling bins → Compost system → Solar panels → Smart eco-home → Self-sustaining ecosystem',
      color: 'from-emerald-500 to-teal-700',
      cost: '30 $TRASH = 1 Point'
    },
  ];

  // Participation methods
  const participationMethods = [
    {
      title: 'Physical Recycling',
      description: 'Recycle materials in our AI-powered smart cans to earn $TRASH tokens based on material type and weight.',
      icon: '♻️',
      availability: 'Available in areas with Decycle smart cans',
      benefits: ['Earn tokens based on material value', 'Track your environmental impact', 'Compete in local leaderboards']
    },
    {
      title: 'Virtual Participation',
      description: 'Complete virtual quests and challenges to earn $TRASH tokens even if you don\'t live in an area with smart cans.',
      icon: '🎮',
      availability: 'Available worldwide, no smart cans needed',
      benefits: ['Daily quests and challenges', 'Educational mini-games', 'Community-driven initiatives']
    },
    {
      title: 'Real-World Impact',
      description: 'Every $TRASH token and game action directly funds environmental projects that help real people and communities worldwide.',
      icon: '🌍',
      availability: 'Automatic with every interaction',
      benefits: ['Transparent funding allocation', 'Measurable environmental outcomes', 'Support for local communities']
    }
  ];

  return (
    <div>
      {/* Main intro section */}
      <div className="bg-gradient-to-br from-forest/10 to-electric/10 p-6 rounded-xl border border-electric/20 mb-8">
        <h3 className="text-2xl font-bold text-forest mb-3">$TRASH Token Utility</h3>
        
        <p className="mb-5 text-slate">
          Spend your $TRASH tokens to increase ecosystem points in your virtual backyard, creating both visual changes and real-world environmental impact. 
          <span className="font-medium text-forest"> Every in-game action funds real environmental initiatives.</span>
        </p>
        
        {/* Ways to participate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {participationMethods.map((method, index) => (
            <Card 
              key={index} 
              className="p-4 h-full flex flex-col bg-white border border-forest/10 shadow-sm" 
              hover
            >
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">{method.icon}</div>
                <h4 className="text-lg font-bold text-forest">{method.title}</h4>
              </div>
              <p className="text-slate text-sm mb-3">{method.description}</p>
              <div className="mt-auto">
                <div className="bg-forest/5 rounded-lg p-2 text-xs">
                  <p className="font-medium text-forest mb-1">{method.availability}</p>
                  {/* <ul className="list-disc list-inside text-slate">
                    {method.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul> */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Game features highlight */}
      <div className="bg-gradient-to-br from-forest to-forest-light text-white rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Play & Create Impact</h3>
        <p className="mb-4">
          Your virtual sanctuary evolves as you invest in ecosystem points, with each upgrade visually representing your environmental contribution.
          Collect Eco-Guardian animals, complete quests, and join community challenges to maximize your impact.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">🏡</div>
            <h4 className="font-bold text-electric text-sm">Evolving Backyard</h4>
            <p className="text-xs text-white/80">Visual changes reflect your environmental impact</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">🦁</div>
            <h4 className="font-bold text-electric text-sm">Eco-Guardians</h4>
            <p className="text-xs text-white/80">Collect 150+ endangered animal species</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl mb-1">🌍</div>
            <h4 className="font-bold text-electric text-sm">Community Impact</h4>
            <p className="text-xs text-white/80">Join global challenges for collective change</p>
          </div>
        </div>
      </div>
      
            {/* Ecosystem points cards */}
            <h3 className="text-xl font-bold text-forest mb-4">Ecosystem Point Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ecosystemPoints.map((point, index) => (
          <Card 
            key={index} 
            className="h-full flex flex-col overflow-hidden" 
            padding="none"
            hover
          >
            {/* Card header with consistent height */}
            <div className={`bg-gradient-to-r ${point.color} p-4 text-white flex items-center`}>
              <div className="text-3xl mr-3">{point.icon}</div>
              <h4 className="text-lg font-bold">{point.category} Points</h4>
            </div>
            
            {/* Card content with fixed heights for perfect alignment */}
            <div className="flex-grow flex flex-col">
              {/* Description section - fixed height */}
              <div className="px-4 py-3 h-16 flex items-center border-b border-gray-100">
                <p className="text-slate text-sm">{point.description}</p>
              </div>
              
              {/* Impact section - increased height for enhanced descriptions */}
              <div className="px-4 py-3 h-24 border-b border-gray-100 bg-forest/5">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-forest mr-2"></div>
                  <span className="text-xs font-bold uppercase text-forest/80">Real Impact</span>
                </div>
                <p className="text-forest text-sm pl-4">{point.impact}</p>
              </div>
              
              {/* Progress section - fixed height */}
              {/* <div className="px-4 py-3 h-32">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-forest mr-2"></div>
                  <span className="text-xs font-bold uppercase text-forest/80">Visual Progress</span>
                </div>
                <p className="text-slate text-sm pl-4">{point.progression}</p>
              </div> */}
            </div>
          </Card>
        ))}
      </div>

      {/* Token utility summary */}
      <Card className="p-5 border border-electric/20 bg-electric/5">
        <div className="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-forest">$TRASH Token Flow</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-forest/5 rounded-lg p-3 text-center">
            <div className="text-xl mb-1">💰</div>
            <h4 className="font-bold text-forest text-sm">Earn</h4>
            <p className="text-xs text-slate">Recycle materials in smart cans or complete virtual quests to earn tokens</p>
          </div>
          <div className="bg-forest/5 rounded-lg p-3 text-center">
            <div className="text-xl mb-1">🔄</div>
            <h4 className="font-bold text-forest text-sm">Spend</h4>
            <p className="text-xs text-slate">Use tokens to evolve your virtual backyard and fund environmental initiatives</p>
          </div>
          <div className="bg-gradient-to-br from-forest/20 to-electric/20 rounded-lg p-3 text-center border border-electric/30">
            <div className="text-xl mb-1">🌎</div>
            <h4 className="font-bold text-forest text-sm">Real-World Impact</h4>
            <p className="text-xs text-slate">Every token spent directly funds environmental projects including tree planting, wildlife conservation, ocean cleanup, and renewable energy</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameUtilitySection;
