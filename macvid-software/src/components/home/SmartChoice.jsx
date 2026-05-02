import React from 'react';

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#0066CC] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const SmartChoice = () => {
  const cards = [
    {
      title: "Reclaim Your Time",
      icon: (
        <svg className="w-8 h-8 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Automate day-to-day admin, from booking and billing to clinical notes, and get hours back every week.",
      features: [
        "Intelligent online booking",
        "Automated invoicing & payments",
        "Streamlined clinical records",
        "Powerful reporting dashboard"
      ]
    },
    {
      title: "Grow Your Practice",
      icon: (
        <svg className="w-8 h-8 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      description: "Macvid scales with you, whether you're a single practitioner or a growing multi-location group.",
      features: [
        "Manage multiple locations",
        "Add unlimited team members",
        "Analyse business performance",
        "Integrates with tools you love"
      ]
    },
    {
      title: "Deliver Better Care",
      icon: (
        <svg className="w-8 h-8 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "Our tools help you deliver an exceptional experience for patients and clients that builds loyalty and improves outcomes.",
      features: [
        "Secure portal for patients and clients",
        "Automated reminders & recalls",
        "Flexible payment plans",
        "Dedicated Indian support"
      ]
    }
  ];

  return (
    <section className="bg-[#F4F7F9] py-16 px-4 md:px-12 lg:px-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 mb-4 leading-tight">
            The Smart, Scalable Choice for Your Clinic
          </h2>
          <p className="text-primary text-sm sm:text-base font-bold">
            Automate admin, connect systems, and keep costs under control with a platform built for ambitious clinics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col border border-gray-100/50"
            >
              {/* Card Header (Icon & Title) */}
              <div className="flex items-center gap-3 mb-6 text-gray-700">
                {card.icon}
                <h3 className="text-lg sm:text-xl font-bold text-gray-700">{card.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm font-medium leading-relaxed mb-8 border-b border-gray-100 pb-8">
                {card.description}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mt-auto">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-700 text-xs sm:text-sm font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartChoice;
