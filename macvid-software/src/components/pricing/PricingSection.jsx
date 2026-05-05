import React, { useState } from 'react';

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const PricingCard = ({ title, subtitle, price, billingPeriod, features, buttonText, isPopular }) => (
  <div className={`relative bg-[#C70000] rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 group flex flex-col h-full shadow-[0_20px_50px_rgba(199,0,0,0.3)] border border-white/10 ${
    isPopular ? 'scale-105 z-10' : ''
  }`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-white text-[#C70000] text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full shadow-lg border border-[#C70000]/20">
        Most Popular
      </div>
    )}

    <div className="mb-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        {title === 'Basic' && <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🏠</div>}
        {title === 'Professional' && <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🏢</div>}
        {title === 'Enterprise' && <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">⭐</div>}
        <h3 className="text-2xl font-black uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed mb-8 h-10">
        {subtitle}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl sm:text-5xl font-black tracking-tighter">
          {price}
        </span>
        <span className="text-white/60 text-sm font-medium">{billingPeriod}</span>
      </div>
      <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-2">
        {billingPeriod === '/month' ? 'Billed monthly' : 'Billed annually'}
      </p>
    </div>

    <div className="w-full h-px bg-white/20 mb-8"></div>

    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-white text-sm sm:text-base font-medium leading-tight group-hover:translate-x-1 transition-transform duration-300">
          <CheckIcon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
          <span className={feature.included ? 'opacity-100' : 'opacity-30'}>{feature.text}</span>
        </li>
      ))}
    </ul>

    <button className={`w-full py-4 font-black uppercase tracking-widest text-xs sm:text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl bg-white text-[#C70000] hover:bg-[#212121] hover:text-white`}>
      {buttonText}
    </button>
  </div>
);

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    monthly: [
      {
        title: "Basic",
        subtitle: "For small clinics and solo practices",
        price: "₹4,999",
        billingPeriod: "/month",
        features: [
          { text: "Up to 5 users", included: true },
          { text: "Basic billing features", included: true },
          { text: "Email support", included: true },
          { text: "Cloud storage (10GB)", included: true },
          { text: "Advanced analytics", included: false },
          { text: "Insurance integration", included: false },
          { text: "Priority support", included: false },
          { text: "Custom workflows", included: false }
        ],
        buttonText: "Get Started"
      },
      {
        title: "Professional",
        subtitle: "For medium hospitals and clinics",
        price: "₹12,999",
        billingPeriod: "/month",
        isPopular: true,
        features: [
          { text: "Up to 25 users", included: true },
          { text: "Advanced billing features", included: true },
          { text: "Priority email support", included: true },
          { text: "Cloud storage (50GB)", included: true },
          { text: "Basic analytics", included: true },
          { text: "Insurance integration", included: true },
          { text: "24/7 phone support", included: false },
          { text: "Custom workflows", included: false }
        ],
        buttonText: "Get Started"
      },
      {
        title: "Enterprise",
        subtitle: "For large hospitals and chains",
        price: "₹24,999",
        billingPeriod: "/month",
        features: [
          { text: "Unlimited users", included: true },
          { text: "All billing features", included: true },
          { text: "24/7 priority support", included: true },
          { text: "Unlimited cloud storage", included: true },
          { text: "Advanced analytics", included: true },
          { text: "Insurance integration", included: true },
          { text: "Dedicated account manager", included: true },
          { text: "Custom workflows", included: true }
        ],
        buttonText: "Get Started"
      }
    ],
    yearly: [
      {
        title: "Basic",
        subtitle: "For small clinics and solo practices",
        price: "₹49,999",
        billingPeriod: "/year",
        features: [
          { text: "Up to 5 users", included: true },
          { text: "Basic billing features", included: true },
          { text: "Email support", included: true },
          { text: "Cloud storage (10GB)", included: true },
          { text: "Advanced analytics", included: false },
          { text: "Insurance integration", included: false },
          { text: "Priority support", included: false },
          { text: "Custom workflows", included: false }
        ],
        buttonText: "Get Started"
      },
      {
        title: "Professional",
        subtitle: "For medium hospitals and clinics",
        price: "₹129,999",
        billingPeriod: "/year",
        isPopular: true,
        features: [
          { text: "Up to 25 users", included: true },
          { text: "Advanced billing features", included: true },
          { text: "Priority email support", included: true },
          { text: "Cloud storage (50GB)", included: true },
          { text: "Basic analytics", included: true },
          { text: "Insurance integration", included: true },
          { text: "24/7 phone support", included: false },
          { text: "Custom workflows", included: false }
        ],
        buttonText: "Get Started"
      },
      {
        title: "Enterprise",
        subtitle: "For large hospitals and chains",
        price: "₹249,999",
        billingPeriod: "/year",
        features: [
          { text: "Unlimited users", included: true },
          { text: "All billing features", included: true },
          { text: "24/7 priority support", included: true },
          { text: "Unlimited cloud storage", included: true },
          { text: "Advanced analytics", included: true },
          { text: "Insurance integration", included: true },
          { text: "Dedicated account manager", included: true },
          { text: "Custom workflows", included: true }
        ],
        buttonText: "Get Started"
      }
    ]
  };

  return (
    <div className="relative">
      {/* Hero Section - Near full screen, bg-[#212121] */}
      <section className="bg-[#212121] min-h-[90vh] sm:min-h-screen relative flex flex-col px-6 sm:px-12">
        {/* Centered Content Area */}
        <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col justify-center items-center text-center pb-[280px] sm:pb-[320px] lg:pb-[350px]">
          <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Pricing plans <span className="text-[#C70000]">for</span> <br className="hidden sm:block" />
            every need
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium mb-12">
            The most affordable hospital billing software.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-[#C70000]' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-500 ease-in-out cursor-pointer"
            >
              <div className={`w-6 h-6 bg-[#C70000] rounded-full shadow-md transform transition-transform duration-500 ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-[#C70000]' : 'text-gray-400'}`}>
              Yearly <span className="text-[10px] ml-1 bg-[#C70000]/10 px-2 py-0.5 rounded-full">(Save 16%)</span>
            </span>
          </div>
        </div>

        {/* Cards anchored at bottom of hero, overlapping into dark section */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-6 sm:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {plans[billingCycle].map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section - provides background behind lower half of cards */}
      <section className="bg-[#212121] pt-[320px] sm:pt-[380px] lg:pt-[420px] pb-24 sm:pb-40">
      </section>
    </div>
  );
};

export default PricingSection;

