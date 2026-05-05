import React from 'react';
import FeatureCard from './FeatureCard';

// Icons
const BillingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DataIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const AccessIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const FeaturesHero = () => {
  const features = [
    {
      title: "Automated Billing",
      description: "Generate accurate bills automatically with built-in validation",
      icon: BillingIcon,
      items: ["Real-time billing calculations", "Multi-currency support", "Tax calculation automation", "Discount management"],
      isHighlighted: false
    },
    {
      title: "Centralized Data",
      description: "Unified patient records and billing information",
      icon: DataIcon,
      items: ["Patient history tracking", "Cross-department data sharing", "Search and filter capabilities", "Data export options"],
      isHighlighted: true
    },
    {
      title: "Role-based Access",
      description: "Secure access controls based on staff roles",
      icon: AccessIcon,
      items: ["Custom permission sets", "Audit trail logging", "Multi-factor authentication", "Session management"],
      isHighlighted: false
    },
    {
      title: "Cloud Infrastructure",
      description: "Secure cloud storage with automatic backups",
      icon: CloudIcon,
      items: ["99.9% uptime guarantee", "Automatic data backup", "Scalable storage", "Disaster recovery"],
      isHighlighted: false
    }
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex flex-col pt-32 sm:pt-40 pb-10 sm:pb-20">
      {/* Background with split aesthetic */}
      <div className="absolute inset-0 z-0 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 h-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000"
            alt="Healthcare Context"
            className="w-full h-full object-cover opacity-60 grayscale"
          />
        </div>
        <div className="w-full sm:w-1/2 h-full bg-[#1a1a1a]"></div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 w-full flex-grow flex flex-col">
        {/* Main Hero Text */}
        <div className="text-right ml-auto mt-12 sm:mt-20">
          <div className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-[0.4em] mb-4 flex gap-8 justify-end">
            <span>Powerful Features for Modern Hospital Billing</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter uppercase whitespace-nowrap">
            EFFICIENT.<br />
            SECURE.<br />
            <span className="text-red-700">SEAMLESS.</span>
          </h1>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesHero;
