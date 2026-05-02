import React from 'react';
import expertsImage from "../../assets/india-experts.png";

const IndiaExpertise = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Side: Content */}
        <div className="flex-1 max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 leading-tight mb-6">
            Built for Indian Healthcare, <br className="hidden md:block" /> By Indian Healthcare Experts
          </h2>

          <p className="text-primary text-sm md:text-base font-bold mb-8 leading-relaxed">
            We understand Indian regulations, payment flows, and patients and clients' expectations -
            so the platform does too.
          </p>

          <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed font-medium">
            <p>
              At <span className="font-bold">Macvid</span>, we started with a simple belief:
              practices and clinics deserve technology that truly understands their world.
              Too many teams are stuck with clunky systems or generic platforms that don't reflect
              the realities of Indian healthcare. We saw professionals wasting hours battling software
              instead of supporting patients and clients - and knew there had to be a better way.
            </p>

            <p>
              That's why we built Macvid from the ground up with healthcare leaders.
              Our platform streamlines bookings, records, and reporting, while integrated payments
              deliver seamless invoicing, faster cash flow, and competitive rates. The result?
              Smarter workflows, less admin, and more time where it matters most - growing your
              clinic and caring for people.
            </p>
          </div>

          <div className="mt-10">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors font-semibold text-sm flex items-center gap-2 group">
              Let's explore how that local insight speeds up your team's day.
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: Image with Floating Icons */}
        <div className="flex-1 relative flex justify-center lg:justify-end">
          <div className="relative max-w-[500px]">
            {/* Main Image */}
            <img
              src={expertsImage}
              alt="Indian Healthcare Experts"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            />

            {/* Floating Icons Style from Screenshot */}
            <div className="absolute -left-6 top-1/4 flex flex-col gap-3">
              <div className="bg-[#00AEEF] p-2.5 rounded-lg shadow-lg text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="bg-[#8CC63F] p-2.5 rounded-lg shadow-lg text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="bg-[#4D69B1] p-2.5 rounded-lg shadow-lg text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            {/* Bottom Overlay Icon Card */}
            <div className="absolute -left-10 bottom-12 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex flex-col gap-1">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                <div className="w-10 h-1.5 bg-gray-100 rounded-full"></div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="w-6 h-6 bg-[#0066CC]/20 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#0066CC] rounded-sm"></div>
                  </div>
                  <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
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
