import React from 'react';

const Step = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="text-4xl sm:text-5xl font-black text-[#C70000] mb-4 tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity duration-300">
      {number}
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#C70000] transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-[280px]">
      {description}
    </p>
  </div>
);

const SeamlessImplementation = () => {
  const steps = [
    {
      number: "01",
      title: "Assessment",
      description: "We analyze your current billing processes to identify gaps and opportunities."
    },
    {
      number: "02",
      title: "Implementation",
      description: "Custom setup and seamless data migration from your existing legacy systems."
    },
    {
      number: "03",
      title: "Training",
      description: "Comprehensive staff training and ongoing support to ensure team proficiency."
    }
  ];

  return (
    <section className="bg-[#212121] py-20 sm:py-24 lg:py-32 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Seamless <span className="text-[#C70000]">Implementation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Our team ensures smooth transition and comprehensive training for your entire medical staff.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-8 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#C70000]/30 to-transparent z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20 relative z-10">
            {steps.map((step, index) => (
              <Step key={index} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeamlessImplementation;
