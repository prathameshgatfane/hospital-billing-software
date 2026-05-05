import React from 'react';

const PricingCTA = () => {
  return (
    <section className="bg-[#212121] py-24 sm:py-32 px-6 sm:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-[#C70000] rounded-[2.5rem] p-10 sm:p-20 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 group">

          {/* Decorative Concentric Circles (SVG Effect) */}
          <div className="absolute top-1/2 -right-24 sm:-right-40 -translate-y-1/2 flex items-center justify-center z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
            <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border-[30px] sm:border-[50px] border-white/40"></div>
            <div className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] rounded-full border-[30px] sm:border-[50px] border-white/60"></div>
            <div className="absolute w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full border-[30px] sm:border-[50px] border-white/80"></div>
            <div className="absolute w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-full border-[30px] sm:border-[50px] border-white/100 bg-white shadow-2xl"></div>
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full lg:w-3/5 text-center lg:text-left">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
              Start Your 30-Day Free Trial
            </h2>
            <p className="text-white/80 text-lg sm:text-xl font-medium max-w-xl mb-12 mx-auto lg:mx-0">
              Unlock the full potential of MacVid Practice Management with a 30-day free trial. Experience every feature, optimize your billing, and see how seamless your practice operations can be.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* Button 1 */}
              <button className="px-8 py-4 bg-black rounded-full flex items-center gap-4 group/btn hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm">
                  Start Free Trial
                </span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center transform group-hover/btn:translate-x-1 transition-transform duration-300">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </button>

              {/* Button 2 */}
              <button className="px-8 py-4 bg-black rounded-full flex items-center gap-4 group/btn hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm">
                  Contact Sales
                </span>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center transform group-hover/btn:translate-x-1 transition-transform duration-300">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingCTA;
