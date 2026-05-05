import React from 'react';

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SupportIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5 hover:border-[#C70000]/30 transition-all duration-500 group flex flex-col items-center text-center shadow-2xl h-full">
    <div className="w-16 h-16 bg-[#C70000]/10 rounded-2xl flex items-center justify-center text-[#C70000] mb-8 group-hover:bg-[#C70000] group-hover:text-white transition-all duration-500 shadow-lg">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{title}</h3>
    <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

const PricingFeatures = () => {
  const features = [
    {
      icon: ShieldIcon,
      title: "Security First",
      description: "HIPAA compliant with end-to-end encryption for all your patient data."
    },
    {
      icon: SupportIcon,
      title: "24/7 Support",
      description: "Round-the-clock technical support to ensure your billing never stops."
    },
    {
      icon: RefreshIcon,
      title: "Regular Updates",
      description: "Continuous feature enhancements and security patches at no extra cost."
    }
  ];

  return (
    <section className="bg-[#212121] py-24 sm:py-32 px-6 sm:px-12 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-6">
            Everything <span className="text-[#C70000]">You Need</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            All plans include essential features for modern hospital billing and patient management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFeatures;
