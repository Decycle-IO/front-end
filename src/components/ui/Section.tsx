import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import Container from './Container';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  bgColor?: string;
  withContainer?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  id,
  containerSize = 'lg',
  bgColor = 'bg-white',
  withContainer = true,
  className = '',
  ...props
}) => {
  const sectionClasses = `py-16 md:py-24 ${bgColor} ${className}`;
  
  return (
    <section id={id} className={sectionClasses} {...props}>
      {withContainer ? (
        <Container size={containerSize}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
