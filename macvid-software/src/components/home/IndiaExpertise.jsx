import React from 'react';
import expertsImage from "../../assets/india-experts.png";

const IndiaExpertise = () => {
  return (
    <section className="bg-[#212121] py-24 px-4 md:px-12 lg:px-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Left Side: Content */}
        <div className="flex-1 max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
          <div className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-6">Expertise</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tighter">
            Built for Indian Healthcare, <br className="hidden md:block" /> By Indian Experts
          </h2>

          <p className="text-white text-base md:text-lg font-bold mb-10 leading-relaxed max-w-xl">
            We understand Indian regulations, payment flows, and patient expectations -
            so the platform does too.
          </p>

          <div className="space-y-8 text-gray-400 text-base md:text-lg leading-relaxed font-medium">
            <p>
              At <span className="text-white font-bold">Makwid</span>, we started with a simple belief:
              practices and clinics deserve technology that truly understands their world.
              Too many teams are stuck with clunky systems or generic platforms that don't reflect
              the realities of Indian healthcare.
            </p>

            <p>
              That's why we built Makwid from the ground up with healthcare leaders.
              Our platform streamlines bookings, records, and reporting, while integrated payments
              deliver seamless invoicing, faster cash flow, and competitive rates.
            </p>
          </div>

          <div className="mt-12">
            <a href="#" className="text-white hover:text-primary transition-all font-bold text-sm flex items-center gap-3 group tracking-widest uppercase">
              Learn about our local insight
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500">
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Right Side: Image with Floating Icons */}
        <div className="flex-1 relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right duration-1000">
          <div className="relative max-w-[500px]">
            {/* Glow Effect behind image */}
            <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full -z-10"></div>

            {/* Main Image */}
            <img
              src={expertsImage}
              alt="Indian Healthcare Experts"
              className="rounded-[2.5rem] shadow-2xl w-full h-auto object-cover border border-white/5"
            />

            {/* Floating Icons Style from Screenshot */}
            <div className="absolute -left-8 top-1/4 flex flex-col gap-4">
              <div className="bg-[#00AEEF] p-3.5 rounded-2xl shadow-2xl text-white transform hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-[#8CC63F] p-3.5 rounded-2xl shadow-2xl text-white transform hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="bg-[#4D69B1] p-3.5 rounded-2xl shadow-2xl text-white transform hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            {/* Bottom Overlay Icon Card */}
            <div className="absolute -left-12 bottom-12 bg-[#1a1a1a]/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/10 hidden md:block transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex flex-col gap-2">
                <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                <div className="w-12 h-2 bg-white/5 rounded-full"></div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                    <div className="w-4 h-4 bg-primary rounded-sm"></div>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                    <div className="w-4 h-4 bg-white/40 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndiaExpertise;
