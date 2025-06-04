import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';

const ProblemSolution: React.FC = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Section 
      id="problem-solution" 
      className="pt-0 -mt-56 md:-mt-80 relative z-10"
      bgColor="bg-transparent"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {/* Problem */}
        <motion.div
          custom={0}
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card variant="elevated" className="p-5 md:p-8 h-full rounded-xl border border-gray-100 shadow-lg bg-white/95 backdrop-blur-sm">
            <div className="flex items-center mb-5 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center mr-3 md:mr-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                The <span className="text-red-500">Problem</span>
              </h3>
            </div>
            <ul className="space-y-3 md:space-y-4">
              {[
                "Lack of incentives for individuals to recycle properly",
                "Manual sorting is inefficient and error-prone",
                "No transparency in the recycling supply chain",
                "Difficulty tracking environmental impact",
                "Limited accessibility to recycling infrastructure"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-slate text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Solution */}
        <motion.div
          custom={1}
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card variant="elevated" className="p-5 md:p-8 h-full rounded-xl border border-gray-100 shadow-lg bg-white/95 backdrop-blur-sm">
            <div className="flex items-center mb-5 md:mb-8">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-forest/10 rounded-full flex items-center justify-center mr-3 md:mr-4 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Our <span className="text-forest">Solution</span>
              </h3>
            </div>
            <ul className="space-y-3 md:space-y-4">
              {[
                "Token rewards for recycling contributions",
                "AI-powered automatic sorting technology",
                "Blockchain-based transparency and traceability",
                "Real-time environmental impact tracking",
                "Facial recognition for easy user identification"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-forest/10 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate text-base md:text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
};

export default ProblemSolution;
