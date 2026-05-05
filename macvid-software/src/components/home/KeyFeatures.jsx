import React from 'react';

const features = [
  {
    title: "Integrated Payments with ClearAccept",
    description: "Take secure, PCI-compliant payments in person or online with automatic reconciliation.",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    title: "Insurance Billing with Healthcode",
    description: "Submit bills electronically and track claim statuses directly from e-clinic.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Invoices & Receipts",
    description: "Generate branded invoices and receipts linked to appointments and treatments.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Treatment Packages & Memberships",
    description: "Manage prepaid bundles or subscriptions with automated balance tracking.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  },
  {
    title: "Corporate Billing",
    description: "Configure workflows for occupational health and employer contracts.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Real-Time Financial Reporting",
    description: "Access revenue dashboards and export detailed financial reports.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const KeyFeatures = () => {
  return (
    <section className="bg-[#212121] lg:h-screen lg:min-h-[800px] py-12 sm:py-16 md:py-20 px-4 md:px-12 lg:px-20 relative overflow-hidden flex flex-col justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col h-full lg:max-h-[90vh]">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="text-primary font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">About the platform</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tighter">
              Transforming billing <br />
              with <span className="text-primary italic">cutting-edge</span> strategy
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium leading-relaxed">
              Run the entire patient journey without hopping between systems. Designed for modern healthcare efficiency.
            </p>
          </div>
        </div>

        {/* Staggered Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 flex-grow">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#1a1a1a] border border-white/5 transition-all duration-700 hover:border-white/10 flex flex-col shadow-2xl
                ${index === 0 || index === 2 ? 'lg:row-span-2 min-h-[250px] md:min-h-[400px] lg:min-h-0' : 'min-h-[200px] md:min-h-[300px] lg:min-h-0'}
              `}
            >
              {/* Category Tag */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                <div className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  {feature.title.split(' ')[0]}
                </div>
              </div>

              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto p-5 sm:p-8 md:p-10">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mb-3 md:mb-6 group-hover:scale-150 transition-transform duration-500 shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight group-hover:text-primary transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-700">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-8 md:mt-12 lg:mt-16 flex justify-center">
          <button className="group flex items-center gap-4 text-white font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:text-primary transition-colors duration-300">
            <span>Explore all features</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all duration-500">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
