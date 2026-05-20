import React from 'react';

const stats = [
  {
    label: "Success Rate",
    value: "98.7%",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  {
    label: "Faster",
    value: "70%",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    label: "Revenue",
    value: "₹2.4Cr+",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: "Support",
    value: "24/7",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

const StatsMarquee = () => {
  return (
    <div className="bg-red-700 py-6 border-y border-white/10 overflow-hidden relative group">
      <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] transition-all duration-500">
        {/* First Set */}
        {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
          <div key={index} className="inline-flex items-center gap-16 px-24 border-r border-white/5 last:border-none">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">
                {stat.value}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest opacity-80">
                  {stat.label}
                </span>
                <div className="text-black transform hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsMarquee;
