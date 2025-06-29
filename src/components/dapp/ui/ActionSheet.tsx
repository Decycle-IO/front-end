import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Determine height class
  const getHeightClass = () => {
    switch (height) {
      case 'half':
        return 'h-1/2';
      case 'full':
        return 'h-[90vh]';
      default:
        return 'max-h-[80vh]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 ${getHeightClass()}`}
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-2 pb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Title */}
            {title && (
              <div className="px-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-forest">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
