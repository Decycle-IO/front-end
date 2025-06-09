import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { SidebarProps } from '../../types/ui';

// Icons would typically come from lucide-react or another icon library
const DashboardIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;
const GarbageCanIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;
const StakingIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;
const QuestsIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;
const AchievementsIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;
const ProfileIcon = () => <div className="w-5 h-5 bg-current opacity-80 rounded-sm" />;

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/garbage-cans', label: 'Garbage Cans', icon: <GarbageCanIcon /> },
  { path: '/staking', label: 'Staking', icon: <StakingIcon /> },
  { path: '/quests', label: 'Quests', icon: <QuestsIcon /> },
  { path: '/achievements', label: 'Achievements', icon: <AchievementsIcon /> },
  { path: '/profile', label: 'Profile', icon: <ProfileIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-primary-600">Trash DApp</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={onClose}
                    >
                      <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Trash DApp
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
