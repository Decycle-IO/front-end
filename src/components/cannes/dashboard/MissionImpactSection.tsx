import React from 'react';
import { motion } from 'framer-motion';

const MissionImpactSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WHAT We Do */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-forest">WHAT We Do</h3>
            </div>
            
            <div className="space-y-3 text-slate">
              <p>
                <span className="font-medium text-charcoal">Decycle</span> is a decentralized recycling ecosystem that extends far beyond this conference demo, creating a global, decentralized recycling network.
              </p>
              <p>
                Our smart recycling technology uses advanced sensors and AI to accurately identify and sort recyclable materials, while blockchain integration ensures transparent tracking and verification.
              </p>
              <p>
                We incentivize participation through a token economy that rewards sustainable behaviors, making environmental responsibility financially rewarding for individuals and communities.
              </p>
              <p>
                The complete Decycle ecosystem connects consumers, recycling centers, manufacturers, and environmental organizations in a circular economy that maximizes resource efficiency.
              </p>
            </div>
          </div>
          
          {/* WHY We Do It */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-forest">WHY We Do It</h3>
            </div>
            
            <div className="space-y-3 text-slate">
              <p>
                <span className="font-medium text-charcoal">Global Crisis:</span> The world produces over 2 billion tons of waste annually, with only a fraction properly recycled. Our planet is facing unprecedented environmental challenges that require innovative solutions.
              </p>
              <p>
                <span className="font-medium text-charcoal">System Failure:</span> Current recycling systems are fragmented, inefficient, and lack proper incentives. Decycle addresses these systemic issues through technology and economic alignment.
              </p>
              <p>
                <span className="font-medium text-charcoal">Economic Opportunity:</span> The circular economy represents a $4.5 trillion economic opportunity. By making recycling profitable, we can align environmental and economic interests.
              </p>
              <p>
                <span className="font-medium text-charcoal">Technological Revolution:</span> Blockchain, IoT, and AI technologies have matured to a point where they can transform waste management in ways previously impossible.
              </p>
            </div>
          </div>
          
          {/* HOW You Can Help */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-forest">HOW You Can Help</h3>
            </div>
            
            <div className="space-y-3 text-slate">
              <p>
                <span className="font-medium text-charcoal">Kickstart Our Company:</span> Your donations provide the essential initial funding needed to launch Decycle as a viable business and develop our technology beyond the prototype stage.
              </p>
              <p>
                <span className="font-medium text-charcoal">Fund Real-World Implementation:</span> Contributions directly finance the manufacturing of smart bins, sensor technology, and recycling infrastructure.
              </p>
              <p>
                <span className="font-medium text-charcoal">Gain Recognition:</span> As a Green Guardian, your name and logo will be prominently displayed at our booth and in our app, showcasing your commitment to sustainable blockchain solutions.
              </p>
              <p>
                <span className="font-medium text-charcoal">Create Tangible Impact:</span> By supporting Decycle, you help build practical technology that addresses real environmental challenges while demonstrating blockchain's utility beyond financial applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionImpactSection;
