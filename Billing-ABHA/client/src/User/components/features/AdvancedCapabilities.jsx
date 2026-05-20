import React from 'react';

const CapabilityCard = ({ title, description, image, spanClass }) => (
  <div className={`relative ${spanClass} flex flex-col group overflow-hidden bg-[#212121] rounded-[1.5rem] sm:rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] border border-white/10`}>
    {/* Background Image - Bright and Original */}
    <div className="absolute inset-0 z-0">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
      />
      {/* Bottom Gradient for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
    </div>
    
    <div className="relative z-10 mt-auto p-5 sm:p-8 text-left">
      <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">{title}</h3>
      <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-[280px] font-medium drop-shadow-md">
        {description}
      </p>
    </div>
  </div>
);

const AdvancedCapabilities = () => {
  const capabilities = [
    {
      title: "Revenue Analytics",
      description: "Comprehensive financial insights and reporting for your hospital",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-6 h-[170px] sm:h-[250px] lg:h-[320px]"
    },
    {
      title: "Insurance Claims",
      description: "Automated claim processing with major insurers in real-time",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-3 h-[170px] sm:h-[250px] lg:h-[320px]"
    },
    {
      title: "Payment Processing",
      description: "Secure multiple payment gateway integrations",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-3 h-[170px] sm:h-[250px] lg:h-[320px]"
    },
    {
      title: "Audit Compliance",
      description: "Automated compliance checks and audit trails",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-4 h-[170px] sm:h-[230px] lg:h-[280px]"
    },
    {
      title: "Real-time Sync",
      description: "Live data synchronization across all devices",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-4 h-[170px] sm:h-[230px] lg:h-[280px]"
    },
    {
      title: "Team Collaboration",
      description: "Multi-user workspace with task management",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
      spanClass: "col-span-1 lg:col-span-4 h-[170px] sm:h-[230px] lg:h-[280px]"
    }
  ];

  return (
    <section className="bg-[#212121] py-16 sm:py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-4 leading-tight">
            Advanced <span className="text-red-700">Capabilities</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-xl max-w-2xl font-medium mx-auto">
            Additional features that make Mapvon the complete solution for healthcare institutions.
          </p>
        </div>

        {/* Responsive Bento Grid: 2 columns on mobile, 12 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-6">
          {capabilities.map((cap, index) => (
            <CapabilityCard key={index} {...cap} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedCapabilities;
