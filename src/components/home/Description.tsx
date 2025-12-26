import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';

const Description: React.FC = () => {
  return (
    <Section 
      id="description" 
      className="py-16 md:py-24"
      bgColor="bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-xl md:text-2xl text-slate leading-relaxed max-w-3xl mx-auto font-light">
            Decycle bridges AI-powered smart hardware with transparent, Web3 financial incentives to turn waste from an environmental cost into a globally distributed, community-owned asset.
          </p>
          <p className="text-xl md:text-2xl text-slate leading-relaxed max-w-3xl mx-auto font-light">
            <span className="font-semibold text-forest">Financially sustainable infrastructure</span> that makes recycling profitable, engaging, and fully transparent. We establish the infrastructure needed to make recycling profitable, starting where it is needed most.
          </p>
        </motion.div>
      </div>
    </Section>
  );
};

export default Description;

