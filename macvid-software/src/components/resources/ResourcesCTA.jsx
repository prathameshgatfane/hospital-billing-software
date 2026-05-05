import React from 'react';

const ResourcesCTA = () => {
  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-24 sm:py-32 px-6 sm:px-12 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-[#C70000] rounded-[2.5rem] p-10 sm:p-20 overflow-hidden shadow-2xl flex flex-col items-center text-center gap-8 group">
          
          {/* Decorative Concentric Circles (matching our design language) */}
          <div className="absolute top-1/2 -right-24 sm:-right-40 -translate-y-1/2 flex items-center justify-center z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
            <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-[30px] sm:border-[50px] border-white/40"></div>
            <div className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] rounded-full border-[30px] sm:border-[50px] border-white/60"></div>
            <div className="absolute w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full border-[30px] sm:border-[50px] border-white/80"></div>
            <div className="absolute w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-full border-[30px] sm:border-[50px] border-white/100 bg-white shadow-2xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-4 leading-tight">
              Need Additional Help?
            </h2>
            <p className="text-white/80 text-lg sm:text-xl font-medium mb-12">
              Our support team is here to assist you
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-12">
              <button className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all duration-300 shadow-2xl">
                Contact Support
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all duration-300 shadow-2xl">
                Schedule Call
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-white font-bold text-sm sm:text-base tracking-wide">
                Email: <span className="text-white/70">mapvon1@gmail.com</span> | Phone: <span className="text-white/70">9021199661</span>
              </p>
              <p className="text-white font-black text-xs uppercase tracking-[0.3em] opacity-60">
                Support Hours: 24/7
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ResourcesCTA;
