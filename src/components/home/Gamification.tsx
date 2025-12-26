import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';

const Gamification: React.FC = () => {

  return (
    <Section id="gamification" bgColor="bg-gradient-to-b from-gray-50 to-white" className="pt-0 -mt-4 md:-mt-16">
      
      {/* Token Utility - Enhanced Version */}
      <motion.div
        className="mb-12 -mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Main intro section */}
        <div className="bg-gradient-to-br from-forest/10 to-electric/10 p-6 rounded-xl border border-electric/20 mb-6">
          <h3 className="text-2xl font-bold text-forest mb-3">Recycle-to-Earn Model</h3>
          
          <p className="mb-5 text-slate">
            Our Smart Cans instantly identify and weigh your recyclables, rewarding you with tokens based on material type and volume. 
            <span className="font-medium text-forest"> Every deposit is verified on-chain, ensuring transparency and fair rewards.</span>
          </p>
          
          {/* Ways to participate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 h-full flex flex-col bg-white border border-forest/10 shadow-sm" hover>
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">🤖</div>
                <h4 className="text-lg font-bold text-forest">AI-Powered Sorting</h4>
              </div>
              <p className="text-slate text-sm mb-3">Smart Cans use AI and IoT sensors to instantly identify and weigh materials, eliminating human error and ensuring accurate sorting.</p>
              <div className="mt-auto">
                <div className="bg-forest/5 rounded-lg p-2 text-xs">
                  <p className="font-medium text-forest mb-1">Automatic material identification</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 h-full flex flex-col bg-white border border-forest/10 shadow-sm" hover>
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">💰</div>
                <h4 className="text-lg font-bold text-forest">Instant Token Rewards</h4>
              </div>
              <p className="text-slate text-sm mb-3">Receive token rewards immediately based on material type and weight. All transactions are verified on-chain for complete transparency.</p>
              <div className="mt-auto">
                <div className="bg-forest/5 rounded-lg p-2 text-xs">
                  <p className="font-medium text-forest mb-1">Transparent, on-chain rewards</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 h-full flex flex-col bg-white border border-forest/10 shadow-sm" hover>
              <div className="flex items-center mb-3">
                <div className="text-3xl mr-3">📊</div>
                <h4 className="text-lg font-bold text-forest">Verifiable Data</h4>
              </div>
              <p className="text-slate text-sm mb-3">Every deposit generates immutable, on-chain data about material type, volume, quality, and provenance, ensuring trust and transparency.</p>
              <div className="mt-auto">
                <div className="bg-forest/5 rounded-lg p-2 text-xs">
                  <p className="font-medium text-forest mb-1">Immutable blockchain records</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Key benefits highlight */}
        <div id="impact" className="bg-gradient-to-br from-forest to-forest-light text-white rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <p className="mb-4">
            Decycle creates a closed-loop circular economy where every participant benefits. Stakeholders fund infrastructure, users earn rewards, collectors purchase materials, and everyone shares in the value created.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">🏗️</div>
              <h4 className="font-bold text-electric text-sm">Decentralized Ownership</h4>
              <p className="text-xs text-white/80">Stake capital to fund Smart Can deployment and earn recurring revenue</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">♻️</div>
              <h4 className="font-bold text-electric text-sm">Gamified Recycling</h4>
              <p className="text-xs text-white/80">Earn instant token rewards for every verified deposit</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">💵</div>
              <h4 className="font-bold text-electric text-sm">Guaranteed Revenue</h4>
              <p className="text-xs text-white/80">Verified collectors purchase sorted materials at fixed rates</p>
            </div>
          </div>
        </div>
        

        {/* Token utility summary */}
        <Card className="p-5 border border-electric/20 bg-electric/5">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-forest">The Circular Economy Flow</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-forest/5 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">🏗️</div>
              <h4 className="font-bold text-forest text-sm">Stakers Fund</h4>
              <p className="text-xs text-slate">Community members stake capital to fund Smart Can deployment and earn recurring revenue shares</p>
            </div>
            <div className="bg-forest/5 rounded-lg p-3 text-center">
              <div className="text-xl mb-1">♻️</div>
              <h4 className="font-bold text-forest text-sm">Users Recycle</h4>
              <p className="text-xs text-slate">Deposit materials in Smart Cans and earn instant token rewards based on material type and weight</p>
            </div>
            <div className="bg-gradient-to-br from-forest/20 to-electric/20 rounded-lg p-3 text-center border border-electric/30">
              <div className="text-xl mb-1">💵</div>
              <h4 className="font-bold text-forest text-sm">Collectors Purchase</h4>
              <p className="text-xs text-slate">Verified collectors buy pre-sorted materials at fixed rates, ensuring guaranteed revenue for the system</p>
            </div>
          </div>
        </Card>
      </motion.div>




    </Section>
  );
};

export default Gamification;
