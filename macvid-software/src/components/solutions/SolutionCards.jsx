import React from 'react';

const BuildingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MicroscopeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const SolutionCard = ({ icon: Icon, title, description, features, buttonText }) => (
  <div className="bg-[#1a1a1a] rounded-[2rem] p-8 sm:p-10 border border-white/5 hover:border-[#C70000]/30 transition-all duration-500 group flex flex-col h-full shadow-2xl relative overflow-hidden">
    {/* Decorative Glow */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C70000]/5 blur-[80px] rounded-full group-hover:bg-[#C70000]/10 transition-all duration-500"></div>

    <div className="mb-8">
      <div className="w-14 h-14 bg-[#C70000] rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
        {description}
      </p>
    </div>

    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3 text-gray-300 text-sm sm:text-base font-medium">
          <div className="flex-shrink-0 w-5 h-5 bg-[#C70000]/20 rounded-full flex items-center justify-center">
            <CheckIcon className="w-3 h-3 text-[#C70000]" />
          </div>
          {feature}
        </li>
      ))}
    </ul>

    <button className="w-full py-4 bg-[#C70000] text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-xl hover:bg-[#a50000] transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl">
      {buttonText}
      <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
    </button>
  </div>
);

const SolutionCards = () => {
  const solutions = [
    {
      icon: BuildingIcon,
      title: "For Hospitals",
      description: "Comprehensive billing solutions for multi-specialty hospitals",
      features: [
        "Multi-department billing",
        "Insurance claim management",
        "Revenue cycle analytics",
        "Inventory integration"
      ],
      buttonText: "Explore Hospital Solution"
    },
    {
      icon: ActivityIcon,
      title: "For Clinics",
      description: "Streamlined billing for clinics and private practices",
      features: [
        "Quick patient billing",
        "Appointment scheduling",
        "Digital payments",
        "Patient records"
      ],
      buttonText: "Explore Clinic Solution"
    },
    {
      icon: MicroscopeIcon,
      title: "For Diagnostic Centers",
      description: "Specialized solutions for labs and diagnostic centers",
      features: [
        "Test package billing",
        "Sample tracking",
        "Report generation",
        "Insurance approvals"
      ],
      buttonText: "Explore Diagnostic Solution"
    }
  ];

  return (
    <section className="bg-[#212121] pb-24 sm:pb-32 px-6 sm:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionCards;
