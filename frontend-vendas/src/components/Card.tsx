import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: string;
  variant?: 'primary' | 'secondary';
}

const Card: React.FC<CardProps> = ({ title, value, icon, variant = 'primary' }) => {
  const bgColor = variant === 'primary' ? 'bg-blue-500' : 'bg-green-500';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className={`${bgColor} h-2 w-full`}></div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          {icon && <span className="text-2xl">{icon}</span>}
        </div>
      </div>
    </div>
  );
};

export default Card;