import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';

const Technology: React.FC = () => {
  const technologies = [
    {
      title: "AI-Powered Smart Hardware",
      description: "Our Smart Cans use AI and IoT sensors to instantly identify and weigh deposited materials, eliminating human error and ensuring accurate sorting.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      title: "DePIN Infrastructure",
      description: "Decentralized Physical Infrastructure Network that enables community-owned recycling infrastructure through transparent, blockchain-based funding and revenue sharing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "Web3 Financial Incentives",
      description: "Transparent, on-chain token rewards and revenue sharing that create verifiable economic incentives for all participants in the recycling ecosystem.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Verifiable On-Chain Data",
      description: "Every deposit generates immutable, on-chain data about material type, volume, quality, and provenance, ensuring transparency and trust throughout the supply chain.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <Section id="technology" bgColor="bg-gradient-to-br from-forest to-forest-light">
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Technology Highlights
        </motion.h2>
        <motion.div
          className="w-20 h-1 bg-electric mx-auto mb-6"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        ></motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex items-start">
              <div className="w-16 h-16 bg-electric rounded-lg flex items-center justify-center mr-4 shadow-lg">
                {tech.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">{tech.title}</h3>
                <p className="text-white/80">{tech.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-16 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-24 h-24 bg-electric rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3 text-white text-center md:text-left">The Future of Recycling Infrastructure</h3>
            <p className="text-white/80">
              Decycle combines cutting-edge AI hardware with transparent Web3 economics to create the world's first DePIN for recycling. By bridging smart infrastructure with decentralized ownership and guaranteed revenue streams, we're making recycling profitable, engaging, and fully transparent.
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Technology;
