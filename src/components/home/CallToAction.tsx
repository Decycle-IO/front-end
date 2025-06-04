import React from 'react';
import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Button from '../ui/Button';

const CallToAction: React.FC = () => {
  return (
    <Section id="contact" bgColor="bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-charcoal">
            Join the <span className="text-forest">Decycle</span> Revolution
          </h2>
          <p className="text-lg text-slate mb-8">
            We're actively looking for investors, partners, and early adopters to help us bring Decycle to smart cities around the world. Let's make recycling rewarding together.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-charcoal">For Investors</h3>
                <p className="text-slate">
                  Invest in the future of sustainable waste management. Our staking model offers returns while making a positive environmental impact.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-charcoal">For Cities</h3>
                <p className="text-slate">
                  Integrate Decycle into your smart city infrastructure to improve recycling rates and create a cleaner urban environment.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-charcoal">For Collectors</h3>
                <p className="text-slate">
                  Access pre-sorted recyclable materials at a discount and earn by participating in the circular economy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold mb-6 text-charcoal">Get in Touch</h3>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-slate mb-1">
                I'm interested in
              </label>
              <select
                id="interest"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
              >
                <option value="">Select an option</option>
                <option value="investing">Investing</option>
                <option value="partnership">Partnership</option>
                <option value="city-integration">City Integration</option>
                <option value="collecting">Becoming a Collector</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="Tell us about your interest in Decycle..."
              ></textarea>
            </div>
            
            <Button fullWidth size="lg">
              Send Message
            </Button>
            
            <p className="text-xs text-slate text-center mt-4">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </motion.div>
      </div>
    </Section>
  );
};

export default CallToAction;
