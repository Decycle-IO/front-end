import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // Auto-advance through steps until user interaction
  useEffect(() => {
    if (!userInteracted) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prevStep) => (prevStep + 1) % 6);
      }, 3000); // Change step every 3 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userInteracted]);
  
  // Handle user interaction
  const handleInteraction = (index: number) => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    setActiveStep(index);
  };
  
  const steps = [
    {
      title: "Stakers Deploy Smart Cans",
      description: "Community members stake tokens to fund the deployment of Decycle smart trash cans in their neighborhoods.",
      details: "Similar to how Lime scooters work, anyone can become a staker by purchasing and deploying Decycle smart cans. Stakers earn passive income from recycling activities in their area, creating a decentralized recycling infrastructure.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      benefit: "Earn passive income while supporting sustainability",
      color: "from-forest to-forest-light"
    },
    {
      title: "Users Deposit Recyclables",
      description: "Users place recyclable items in the Decycle smart can and are automatically identified through facial recognition.",
      details: "The seamless experience requires no app downloads or QR code scanning. Simply approach the smart can, deposit your recyclables, and the system recognizes you instantly through privacy-preserving facial recognition technology.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benefit: "No apps or cards needed - just drop and go",
      color: "from-cyan to-blue-500"
    },
    {
      title: "AI Sorts Materials",
      description: "Our advanced AI system automatically sorts the materials into the correct recycling categories.",
      details: "Using computer vision technology powered by Nvidia Jetson Nano hardware, the smart can identifies and sorts different types of recyclables. This eliminates contamination issues that plague traditional recycling and ensures higher quality recycled materials.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      benefit: "Eliminates human error in sorting recyclables",
      color: "from-purple-600 to-indigo-700"
    },
    {
      title: "Users Earn Rewards",
      description: "Users receive token rewards based on the type and quantity of materials recycled.",
      details: "Every recycling action earns tokens that are tracked transparently on the blockchain. The reward amount varies based on the material type and current market value, creating a direct financial incentive for sustainable behavior.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benefit: "Get paid for your environmental contributions",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Collectors Purchase Materials",
      description: "Recycling collectors purchase the sorted materials at a discount, creating a circular economy.",
      details: "When smart cans reach capacity, local recycling collectors are notified. They purchase the pre-sorted, high-quality materials at below-market rates, creating a win-win situation. The collectors save on sorting costs while the Decycle ecosystem generates revenue.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      benefit: "Efficient marketplace for recycling businesses",
      color: "from-emerald-500 to-teal-700"
    },
    {
      title: "Stakers Receive Dividends",
      description: "Stakers earn a percentage of all recycling transactions in their deployed smart cans.",
      details: "The revenue generated from material sales is distributed among the ecosystem participants. Stakers receive dividends proportional to their stake, creating a sustainable business model that aligns financial incentives with environmental impact.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      benefit: "Sustainable revenue stream for stakeholders",
      color: "from-forest to-forest-light"
    }
  ];

  return (
    <Section id="how-it-works" bgColor="bg-gradient-to-b from-white to-gray-50" className="pt-0 -mt-8 md:-mt-28">

      {/* Interactive Process Flow */}
      <div className="mb-16">
        <motion.div 
          className="relative flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-6 gap-2 md:gap-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Progress Bar - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="hidden md:block absolute top-1/2 left-0 h-1 bg-electric -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeStep + 1) * (100/6)}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex-shrink-0 w-32 md:w-auto flex flex-col items-center"
            >
              <button
                onClick={() => handleInteraction(index)}
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= activeStep 
                    ? `bg-gradient-to-br ${step.color} shadow-lg` 
                    : 'bg-gray-200'
                }`}
              >
                {index < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={index === activeStep ? "text-white" : "text-gray-500"}>
                    {index + 1}
                  </span>
                )}
              </button>
              <p className={`mt-2 text-xs md:text-sm font-medium text-center transition-colors duration-300 ${
                index <= activeStep ? 'text-forest' : 'text-gray-500'
              }`}>
                {step.title.split(' ')[0]}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Active Step Details */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Visual Element - Fixed height */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${steps[activeStep].color} p-8 h-[400px] flex items-center justify-center shadow-xl`}>
              {/* Background Elements - Fixed positioning */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-x-10 -translate-y-20 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-x-5 translate-y-10 blur-md"></div>
              
              {/* Icon Container - Fixed dimensions */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto">
                  <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-electric flex items-center justify-center shadow-lg">
                      {steps[activeStep].icon}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full max-w-xs mx-auto">
                  <p className="text-white text-center font-medium h-[48px] flex items-center justify-center">
                    {steps[activeStep].benefit}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content - Fixed height with no scrollbars */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card variant="elevated" className="p-8 rounded-xl border border-gray-100 shadow-xl bg-white/90 backdrop-blur-sm h-[400px] flex flex-col">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-forest mb-3 h-[32px] line-clamp-1">{steps[activeStep].title}</h3>
                <p className="text-lg font-medium text-charcoal mb-4 h-[56px] line-clamp-2">{steps[activeStep].description}</p>
                <p className="text-slate h-[160px] line-clamp-7">{steps[activeStep].details}</p>
              </div>
              
              <div className="flex gap-3 mt-6 mb-2">
                <Button 
                  onClick={() => {
                    handleInteraction(Math.max(0, activeStep - 1));
                  }}
                  disabled={activeStep === 0}
                  variant="outline"
                  className={activeStep === 0 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Previous Step
                </Button>
                <Button 
                  onClick={() => {
                    handleInteraction(Math.min(steps.length - 1, activeStep + 1));
                  }}
                  disabled={activeStep === steps.length - 1}
                  className={activeStep === steps.length - 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Next Step
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

export default HowItWorks;
