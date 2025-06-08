import React from 'react';
import type { CardProps } from '../../types/ui';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'md',
  border = true,
  shadow = true,
  hover = false,
}) => {
  // Base classes
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300 bg-white';
  
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  // Border classes
  const borderClasses = border ? 'border border-forest/10' : '';
  
  // Shadow classes
  const shadowClasses = shadow ? 'shadow-sm' : '';
  
  // Hover classes
  const hoverClasses = hover 
    ? 'hover:shadow-md hover:border-electric/30 hover:scale-[1.01] cursor-pointer' 
    : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${borderClasses}
    ${shadowClasses}
    ${hoverClasses}
    ${className}
  `;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
