import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-forest/10 p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-forest">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                {trend.isPositive ? (
                  <path 
                    fillRule="evenodd" 
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" 
                    clipRule="evenodd" 
                  />
                ) : (
                  <path 
                    fillRule="evenodd" 
                    d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" 
                    clipRule="evenodd" 
                  />
                )}
              </svg>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-slate mt-1">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="bg-forest/5 p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
