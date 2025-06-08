import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';

const Gamification: React.FC = () => {
  const ecosystemPoints = [
    { 
      category: 'Flora', 
      icon: '🌱',
      description: 'Invest in plant life and vegetation',
      impact: 'Funds tree planting & habitat restoration',
      progression: 'Evolves from basic grass to magical forest',
      color: 'from-forest to-forest-light'
    },
    { 
      category: 'Fauna', 
      icon: '🦊',
      description: 'Support animal and insect life',
      impact: 'Supports wildlife conservation efforts',
      progression: 'Attracts increasingly rare animal species',
      color: 'from-amber-500 to-orange-600'
    },
    { 
      category: 'Aqua', 
      icon: '💧',
      description: 'Develop water features and aquatic health',
      impact: 'Funds ocean cleanup & water conservation',
      progression: 'Develops from puddles to complex water features',
      color: 'from-cyan to-blue-500'
    },
    { 
      category: 'Sustainability', 
      icon: '♻️',
      description: 'Build eco-friendly infrastructure',
      impact: 'Funds renewable energy projects',
      progression: 'Adds eco-friendly tech to your sanctuary',
      color: 'from-emerald-500 to-teal-700'
    },
  ];

  return (
    <Section id="gamification" bgColor="bg-gradient-to-b from-gray-50 to-white" className="pt-0 -mt-4 md:-mt-16">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-forest"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          $TRASH Token: Play & Create Impact
        </motion.h2>
        <motion.div
          className="w-20 h-1 bg-electric mx-auto mb-6"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
        <motion.p
          className="max-w-3xl mx-auto text-lg text-slate"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Earn $TRASH tokens by recycling in our smart cans or completing virtual quests. Each token represents real environmental value, 
          backed by the materials recycled in our ecosystem. Spend tokens to evolve your virtual backyard while directly funding 
          real environmental initiatives. Every in-game action creates measurable real-world impact, whether you're recycling physically 
          or participating virtually.
        </motion.p>
      </div>

      {/* Eco Gamification System */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-electric/10 p-6 rounded-xl border border-electric/20">
          <h3 className="text-xl font-bold text-forest mb-4">Two Ways to Participate, One Ecosystem</h3>
          
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
      </motion.div>

      {/* Participation Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" hover>
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-bold text-forest mb-2">Physical Recycling</h3>
            <p className="text-slate mb-4">
              Recycle materials in our AI-powered smart cans to earn $TRASH tokens based on material type and weight.
              Stakers deploy cans, collectors pick up materials, and you get rewarded for recycling.
            </p>
            <div className="bg-white/50 p-3 rounded-lg mt-auto">
              <p className="text-forest font-medium text-sm">Available in areas with Decycle smart cans</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" hover>
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-forest mb-2">Virtual Participation</h3>
            <p className="text-slate mb-4">
              Complete virtual quests and challenges to earn $TRASH tokens even if you don't live in an area 
              serviced by Decycle smart cans. Participate in the ecosystem from anywhere.
            </p>
            <div className="bg-white/50 p-3 rounded-lg mt-auto">
              <p className="text-forest font-medium text-sm">Available worldwide, no smart cans needed</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Backyard Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" hover>
            <div className="text-4xl mb-4">🏡</div>
            <h3 className="text-xl font-bold text-forest mb-2">Evolving Backyard</h3>
            <p className="text-slate flex-grow">
              Watch your virtual backyard transform as you invest in ecosystem points, with visual changes reflecting your environmental impact.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" hover>
            <div className="text-4xl mb-4">🦁</div>
            <h3 className="text-xl font-bold text-forest mb-2">Eco-Guardians Collection</h3>
            <p className="text-slate flex-grow">
              Collect 150+ unique Eco-Guardian animals representing endangered species. Complete your Conservation Guide and show off your collection.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 h-full flex flex-col bg-forest/5 border border-forest/20" hover>
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-forest mb-2">Community Impact</h3>
            <p className="text-slate flex-grow">
              Join global challenges where players collectively increase ecosystem points, creating measurable environmental change together.
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Token Utility */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-forest to-forest-light text-white rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-6 md:mb-0 md:mr-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold mb-3 text-center md:text-left">$TRASH Token: The Backbone of Our Ecosystem</h3>
              <p className="mb-4">
                Every $TRASH token represents real environmental value, backed by the materials recycled in our ecosystem. 
                The token flows through our complete cycle: stakers fund smart cans, users recycle to earn tokens, 
                collectors gather materials, and revenue returns to stakers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <h4 className="font-bold text-electric mb-1">Earn</h4>
                  <p className="text-sm">Recycle materials, complete quests, stake in infrastructure</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <h4 className="font-bold text-electric mb-1">Spend</h4>
                  <p className="text-sm">Evolve your backyard, fund environmental projects, collect NFTs</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <h4 className="font-bold text-electric mb-1">Govern</h4>
                  <p className="text-sm">Vote on ecosystem decisions and environmental initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </Section>
  );
};

export default Gamification;
