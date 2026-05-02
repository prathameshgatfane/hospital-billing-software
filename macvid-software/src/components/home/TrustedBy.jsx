import React from 'react';

const TrustedBy = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-[1440px] mx-auto text-center">
        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Trusted by leading healthcare practices across the region
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
          Clinics choose Macvid because we deliver practical results - leaner admin, 
          happier patients and clients, healthier margins.
        </p>

        {/* Logos Grid */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
          {/* Chelsea Psychology Clinic Styled Logo */}
          <div className="bg-[#0A1D37] w-full max-w-[280px] h-32 rounded-2xl flex flex-col items-center justify-center p-6 shadow-xl transform hover:scale-105 transition-transform">
            <div className="text-white text-center">
                <div className="text-[8px] uppercase tracking-[0.4em] mb-1 opacity-60">Psychology Clinic</div>
                <div className="text-xl font-serif tracking-[0.2em] font-light">CHELSEA</div>
                <div className="w-12 h-[1px] bg-white/30 mx-auto mt-2"></div>
            </div>
          </div>

          {/* Harley Medical Group Styled Logo */}
          <div className="bg-white w-full max-w-[280px] h-32 rounded-2xl flex flex-col items-center justify-center p-6 shadow-md border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="text-gray-900 text-center">
                <div className="text-[10px] font-serif italic mb-0.5">The</div>
                <div className="text-lg font-serif tracking-tight leading-none uppercase">Harley</div>
                <div className="text-lg font-serif tracking-tight leading-none uppercase">Medical</div>
                <div className="text-lg font-serif tracking-tight leading-none uppercase">Group</div>
            </div>
          </div>

          {/* Regency Eye Styled Logo */}
          <div className="bg-white w-full max-w-[280px] h-32 rounded-2xl flex items-center justify-center gap-3 p-6 shadow-md border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary rounded-full"></div>
            </div>
            <div className="text-xl font-bold text-gray-900 tracking-tight">Regency<span className="font-light">Eye</span></div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-gray-400 text-[10px] md:text-xs mt-12 font-semibold uppercase tracking-wider">
          Discover the difference a purpose-built clinic platform can make for your team.
        </p>
      </div>
    </section>
  );
};

export default TrustedBy;
