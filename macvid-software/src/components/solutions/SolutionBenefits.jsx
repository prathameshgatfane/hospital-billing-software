import React from 'react';

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SmartphoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1a1a1a] p-8 rounded-[2rem] border border-white/5 hover:border-[#C70000]/30 transition-all duration-500 group flex flex-col items-center text-center shadow-2xl h-full">
    <div className="w-14 h-14 bg-[#C70000]/10 rounded-2xl flex items-center justify-center text-[#C70000] mb-6 group-hover:bg-[#C70000] group-hover:text-white transition-all duration-500 shadow-lg">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
      {description}
    </p>
  </div>
);

const SolutionBenefits = () => {
  const benefits = [
    {
      icon: TrendingUpIcon,
      title: "Revenue Growth",
      description: "Increase revenue by optimizing billing processes and reducing leakages."
    },
    {
      icon: ShieldCheckIcon,
      title: "Compliance",
      description: "Stay fully compliant with local and international healthcare regulations."
    },
    {
      icon: SmartphoneIcon,
      title: "Mobility",
      description: "Access your billing dashboard and patient records from any device, anywhere."
    },
    {
      icon: CloudIcon,
      title: "Scalability",
      description: "Grow your practice from a single clinic to a multi-location group seamlessly."
    }
  ];

  return (
    <section className="bg-[#212121] py-24 sm:py-32 px-6 sm:px-12 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase mb-6">
            Benefits for <span className="text-[#C70000]">All Healthcare Providers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Discover how Makwid transforms billing operations across the healthcare spectrum
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionBenefits;
