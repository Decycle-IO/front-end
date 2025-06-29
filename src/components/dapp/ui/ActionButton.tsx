import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  icon,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  // Determine button styles based on variant
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-electric text-white hover:bg-electric/90 active:bg-electric/80';
      case 'secondary':
        return 'bg-forest text-white hover:bg-forest/90 active:bg-forest/80';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700';
      default:
        return 'bg-electric text-white hover:bg-electric/90 active:bg-electric/80';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${getVariantClasses()}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl py-3 px-6 font-medium shadow-sm
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        min-h-[56px] text-base
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
};
