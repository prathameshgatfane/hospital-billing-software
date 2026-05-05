import React from 'react';

const FeaturesCTA = () => {
  return (
    <section className="bg-[#C70000] py-20 sm:py-32 px-6 sm:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 1000" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,1000 L1000,0 L1000,1000 Z" fill="white" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 text-center">
        <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-tight">
          Ready to Experience <br className="hidden sm:block" />
          These Features?
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto px-10 py-5 bg-white text-[#C70000] text-lg font-bold uppercase tracking-widest rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Get Started Now
          </button>
          <button className="w-full sm:w-auto px-10 py-5 border-2 border-white text-white text-lg font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-all duration-300">
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCTA;
