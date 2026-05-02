import React from 'react';

const features = [
  {
    title: "Integrated Payments with ClearAccept",
    description: "Take secure, PCI-compliant payments in person or online with automatic reconciliation.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    title: "Insurance Billing with Healthcode",
    description: "Submit bills electronically and track claim statuses directly from e-clinic.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Invoices & Receipts",
    description: "Generate branded invoices and receipts linked to appointments and treatments.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Treatment Packages & Memberships",
    description: "Manage prepaid bundles or subscriptions with automated balance tracking.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  {
    title: "Corporate Billing",
    description: "Configure workflows for occupational health and employer contracts.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Real-Time Financial Reporting",
    description: "Access revenue dashboards and export detailed financial reports.",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const KeyFeatures = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-4 leading-tight tracking-tight">
            Key Features of a <br className="hidden sm:block" />
            professional <span className="bg-primary text-white rounded-full px-4 py-1 inline-block mt-1 sm:mt-2 shadow-lg">billing app.</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-medium mt-4 px-4">
            Run the entire patient and client journey without hopping between systems - these are the tools teams use every day.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 rounded-2xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-10 flex flex-col group border border-gray-100"
            >
              {/* Overlapping Circles Icon Container (Scaled Down) */}
              <div className="flex mb-6 md:mb-10 relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center z-10 shadow-md border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75 sm:scale-100">{feature.icon}</div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gray-100 absolute left-5 sm:left-7 md:left-8 border border-gray-50 z-0"></div>
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-dark mb-3 md:mb-6 pr-1">
                {feature.title}
              </h3>

              {/* Dotted Line */}
              <div className="border-b border-dotted border-gray-300 w-full mb-3 md:mb-6 opacity-60 group-hover:border-primary transition-colors duration-300"></div>

              {/* Description */}
              <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium leading-relaxed mt-auto line-clamp-3 md:line-clamp-none">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Footer Text */}
        <div className="text-center mt-12">
            <p className="text-gray-400 font-bold tracking-wide text-[10px] sm:text-xs md:text-sm hover:text-primary transition-colors cursor-pointer uppercase">
                Book a demo to see them in action
            </p>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
