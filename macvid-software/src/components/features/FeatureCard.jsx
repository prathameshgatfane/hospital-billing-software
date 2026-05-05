import React from 'react';

const FeatureCard = ({ title, description, items, icon: Icon, isHighlighted }) => {
  return (
    <div className={`relative p-5 sm:p-6 lg:p-8 flex flex-col h-full min-h-[auto] sm:min-h-[380px] transition-all duration-500 group border border-white/10 overflow-hidden cursor-pointer
      ${isHighlighted ? 'bg-red-700 rounded-br-[3rem] sm:rounded-br-[4rem]' : 'bg-[#1a1a1a] hover:bg-red-700 hover:rounded-br-[3rem] sm:hover:rounded-br-[4rem]'}`}>
      
      {/* Crosshair corners - Top Right */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/20 group-hover:text-white/40 transition-colors">
          <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-4 flex flex-col h-full">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 leading-tight group-hover:text-white transition-colors">
          {title}
        </h3>
        
        {/* Feature Icon Container */}
        <div className="mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 relative">
          <div className={`absolute inset-0 blur-lg transition-all duration-500 ${isHighlighted ? 'bg-white/20' : 'bg-red-700/0 group-hover:bg-white/20'}`}></div>
          <div className={`relative z-10 w-full h-full flex items-center justify-center rounded-xl border transition-all duration-500 
            ${isHighlighted ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20'}`}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 transition-colors duration-500 ${isHighlighted ? 'text-white/90' : 'text-gray-400 group-hover:text-white/90'}`}>
          {description}
        </p>

        {/* Feature List Items from Screenshot */}
        <ul className="space-y-3 mt-auto">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-colors duration-500 ${isHighlighted ? 'text-white' : 'text-red-700 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
              <span className={`text-[11px] sm:text-[13px] font-medium transition-colors duration-500 ${isHighlighted ? 'text-white/90' : 'text-gray-500 group-hover:text-white/90'}`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureCard;
