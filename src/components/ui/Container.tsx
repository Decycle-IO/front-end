import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  ...props
}) => {
  const baseClasses = 'mx-auto px-4';
  
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'w-full',
  };
  
  const containerClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;
  
  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;
