import React from 'react';

const TrustedBy = () => {
  return (
    <section className="bg-[#212121] py-16 sm:py-20 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">
          Trusted by leading healthcare practices <br className="hidden md:block" /> across the region
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
          Clinics choose Macvid because we deliver practical results - leaner admin,
          happier patients and clients, healthier margins.
        </p>

        {/* Logos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {/* Chelsea Psychology Clinic Styled Logo */}
          <div className="bg-red-700 h-32 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-2xl border border-white/10 transform hover:scale-105 transition-all duration-500 hover:border-white/40">
            <div className="text-white text-center">
              <div className="text-[8px] uppercase tracking-[0.4em] mb-1 opacity-80">Psychology Clinic</div>
              <div className="text-xl font-serif tracking-[0.2em] font-light">CHELSEA</div>
              <div className="w-12 h-[1px] bg-white/40 mx-auto mt-2"></div>
            </div>
          </div>

          {/* Harley Medical Group Styled Logo */}
          <div className="bg-red-700 h-32 rounded-[2rem] flex flex-col items-center justify-center p-6 shadow-2xl border border-white/10 transform hover:scale-105 transition-all duration-500 hover:border-white/40">
            <div className="text-white text-center">
              <div className="text-[10px] font-serif italic mb-0.5 opacity-80">The</div>
              <div className="text-lg font-serif tracking-tight leading-none uppercase">Harley</div>
              <div className="text-lg font-serif tracking-tight leading-none uppercase">Medical</div>
              <div className="text-lg font-serif tracking-tight leading-none uppercase">Group</div>
            </div>
          </div>

          {/* Regency Eye Styled Logo */}
          <div className="bg-red-700 h-32 rounded-[2rem] flex items-center justify-center gap-3 p-6 shadow-2xl border border-white/10 transform hover:scale-105 transition-all duration-500 hover:border-white/40">
            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-xl font-bold text-white tracking-tight">Regency<span className="font-light opacity-80">Eye</span></div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-gray-500 text-[10px] md:text-xs mt-16 font-bold uppercase tracking-[0.2em]">
          Discover the difference a purpose-built clinic platform can make
        </p>
      </div>
    </section>
  );
};

export default TrustedBy;
