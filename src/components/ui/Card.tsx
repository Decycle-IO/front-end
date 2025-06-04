import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'feature';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  
  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-300',
    bordered: 'bg-white border border-gray-200',
    feature: 'bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
  };
  
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
