import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <Section 
      id="hero" 
      className="pt-24 pb-64 md:pt-12 md:pb-72 relative overflow-hidden"
      bgColor="bg-gradient-to-br from-white to-gray-50"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-electric/10 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-cyan/10 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-forest/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-electric/5 blur-3xl"></div>
        
        {/* Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 right-0 h-full w-full">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
                <pattern id="circles" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#circles)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-charcoal">
              <span className="relative">
                Revolutionizing <span className="text-forest">Recycling</span>
              </span>
              <br />
              with <span className="text-electric">AI</span> & <span className="text-forest">Zero Knowledge</span>
            </h1>
            <p className="text-lg md:text-xl text-slate mb-6 max-w-xl">
              Decycle combines AI-powered waste recognition, zero-knowledge proofs, and blockchain rewards to make recycling transparent, efficient, and rewarding—transforming environmental action into tangible value.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
            
            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest/10 text-forest">AI-Powered</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-electric/20 text-charcoal">Zero Knowledge</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan/20 text-charcoal">Blockchain</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest/10 text-forest">Eco-Friendly</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative w-full h-[350px] md:h-[400px] bg-gradient-to-br from-forest/80 to-forest rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 md:w-56 md:h-56 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 md:w-40 md:h-40 bg-electric rounded-full flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-electric to-electric-dark opacity-50"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-20 md:w-20 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 w-6 h-6 bg-electric rounded-full"></div>
            <div className="absolute bottom-12 left-12 w-4 h-4 bg-cyan rounded-full"></div>
            <div className="absolute top-1/4 right-10 w-8 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-1/3 right-8 w-5 h-5 bg-electric/50 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Hero;
