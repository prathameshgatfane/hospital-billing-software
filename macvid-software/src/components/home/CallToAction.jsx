import React from 'react';

const CallToAction = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Split (The Bridge) */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-dark"></div>
      </div>

      {/* Container with max-width */}
      <div className="max-w-[1440px] mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto relative group">
          
          {/* Soft Glow Shadow Layer */}
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-[2.5rem] -z-10 group-hover:bg-primary/30 transition-all duration-500"></div>

          {/* Floating Card */}
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-primary via-primaryDark to-[#7F1D1D] shadow-2xl border border-white/10 backdrop-blur-sm">
            
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-black/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-white/5 blur-[40px] rounded-full pointer-events-none"></div>

            {/* SVG Circular Pattern Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="circles" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circles)" />
              </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 md:py-20 flex flex-col items-center text-center">
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 max-w-2xl">
                Simplify Hospital Billing & Payments
              </h2>
              
              <p className="text-white/80 text-sm sm:text-base md:text-lg font-medium max-w-xl mb-10 leading-relaxed">
                Manage invoices, track payments, and streamline operations effortlessly.
              </p>

              <div className="flex flex-col items-center gap-4">
                <button className="group relative bg-gradient-to-r from-[#1a1a1a] to-dark text-white px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 active:scale-95">
                  <span className="relative z-10">Get Started Now</span>
                  {/* Subtle Button Inner Glow */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-all duration-300"></div>
                </button>
                
                <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No setup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
