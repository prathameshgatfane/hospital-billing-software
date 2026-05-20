// StatsCard.jsx
import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'bg-gradient-to-br from-red-600 to-red-800', 
  trend, 
  trendColor = 'text-green-600',
  onClick 
}) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl text-white ${color} p-6 hover:shadow-lg transition-shadow cursor-pointer ${onClick ? 'hover:scale-[1.02] transform transition-transform' : ''}`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <div className="opacity-80">
            {icon}
          </div>
        </div>
        <div className="mb-2">
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trendColor}`}>
            {trend}
          </div>
        )}
      </div>
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <div className="absolute inset-0 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default StatsCard;