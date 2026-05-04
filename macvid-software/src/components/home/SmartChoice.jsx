import React from 'react';

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const SmartChoice = () => {
  const cards = [
    {
      title: "Reclaim Your Time",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <section className="bg-[#212121] py-24 px-4 md:px-12 lg:px-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">Scalability</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tighter">
            The Smart, Scalable Choice for Your Clinic
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Automate admin, connect systems, and keep costs under control with a platform built for ambitious clinics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-red-700 rounded-[2.5rem] p-8 sm:p-10 md:p-12 shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col border border-white/5 hover:border-white/10 group transform hover:-translate-y-2"
            >
              {/* Card Header (Icon & Title) */}
              <div className="flex flex-col gap-6 mb-8 text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-black transition-colors duration-500">{card.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-200 text-sm font-medium leading-relaxed mb-10 border-b border-white/5 pb-10">
                {card.description}
              </p>

              {/* Features List */}
              <ul className="space-y-5 mt-auto">
                {card.features.map((feature, idx) => (
                  <li key={idx} className="text-white flex items-start gap-3">
                    < CheckIcon />
                    <span className="text-white text-sm font-semibold tracking-wide">{feature}</span>
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
