import React from 'react';
import { motion } from 'framer-motion';

interface HandbookHeaderProps {}

const HandbookHeader: React.FC<HandbookHeaderProps> = () => {
  return (
    <header className="bg-forest text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-4 lg:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              Trash-Cannes Live Event Handbook
            </motion.h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-white/80">
              <span>Decycle Live Event Handbook</span>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default HandbookHeader;
