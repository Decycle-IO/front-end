import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCannesGame } from '../hooks/cannes/useCannesGame';
import HandbookHeader from '../components/live/HandbookHeader';
import SystemOverview from '../components/live/SystemOverview';
import LocationMap from '../components/live/LocationMap';
import ProcessFlow from '../components/live/ProcessFlow';
import VolunteerGuide from '../components/live/VolunteerGuide';
import TechnicalSpecs from '../components/live/TechnicalSpecs';
import DemoScripts from '../components/live/DemoScripts';

const Live: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { gameStats, currentBin, recentActivity, isLoading } = useCannesGame();

  const sections = [
    { id: 'overview', title: 'System Overview', component: SystemOverview },
    { id: 'locations', title: 'Locations & Setup', component: LocationMap },
    { id: 'process', title: 'How It Works', component: ProcessFlow },
    { id: 'volunteers', title: 'Volunteer Guide', component: VolunteerGuide },
    { id: 'technical', title: 'Technical Specs', component: TechnicalSpecs },
    { id: 'scripts', title: 'Demo Scripts', component: DemoScripts },
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || SystemOverview;

  return (
    <div className="min-h-screen bg-gray-50">
      <HandbookHeader 
        gameStats={gameStats}
      />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Handbook Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-forest text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent 
                gameStats={gameStats}
                currentBin={currentBin}
                recentActivity={recentActivity}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        </div>
      </motion.main>
      
      <footer className="bg-forest text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-lg font-bold mr-2">Trash-Cannes Live Event Handbook</span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                ETHGlobal Cannes • July 4-6, 2025
              </p>
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Live;
