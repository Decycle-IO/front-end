import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';

const Technology: React.FC = () => {
  const technologies = [
    {
      title: "Play-to-Earn Recycling",
      description: "Turn real-world recycling actions into in-game rewards and progress with our innovative token economy.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Virtual Backyard System",
      description: "Build and customize your virtual backyard with NFT elements earned through recycling achievements.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Impact-Linked Quests",
      description: "Complete in-game quests that directly fund real-world environmental initiatives and recycling infrastructure.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Community Governance",
      description: "Token holders vote on environmental projects to fund and influence the future development of the ecosystem.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
            <h3 className="text-2xl font-bold mb-3 text-white text-center md:text-left">ETHGlobal Prague 2025 Winner</h3>
            <p className="text-white/80">
              Our project was recognized as one of the top 10 best projects at ETHGlobal Prague 2025. The judges were impressed by our innovative approach to recycling, combining hardware with blockchain technology to create a sustainable and incentivized recycling ecosystem.
            </p>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default Technology;
