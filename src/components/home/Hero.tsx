import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';

const Hero: React.FC = () => {
  return (
    <Section 
      id="hero" 
      className="pt-16 pb-24 md:pt-16 md:pb-32 relative overflow-hidden"
      bgColor="bg-gradient-to-b from-electric/5 via-white to-white"
    >
      {/* Subtle mesh gradient background */}
       <div className="absolute inset-0 opacity-30">
         <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl"></div>
         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-sky/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-12 md:gap-16 items-center max-w-7xl mx-auto px-4">
        {/* Brow Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-forest inline-block">
            Revolutionizing Waste Management
          </span>
        </motion.div>

        {/* Heading */}
        <div className="w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-10 leading-[1.1] tracking-tight text-charcoal max-w-5xl mx-auto"
          >
            The World's First{' '}
            <span className="text-forest font-extrabold">DePIN</span>
            <br />
            for <span className="text-forest font-extrabold">Recycling</span>
          </motion.h1>
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate max-w-[650px] mx-auto text-center leading-relaxed font-light mb-6"
        >
          Bridging AI-powered smart hardware with transparent Web3 financial incentives to transform waste into a globally distributed, community-owned asset.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <a
            href="https://linktr.ee/decycle_io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-forest text-white font-semibold rounded-lg hover:bg-forest-light transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Join our Community
          </a>
          <a
            href="#technology"
            className="px-8 py-4 bg-white text-sky font-semibold rounded-lg border-2 border-sky hover:bg-sky/5 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Learn More
          </a>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-6xl"
        >
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-gray-200 bg-gray-900">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/y4fQ4PyLGgI"
              title="Decycle - The World's First DePIN for Recycling"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Hero;
