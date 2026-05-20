import React from 'react';

const SecurityItem = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:transform hover:-translate-y-2">
    <div className="mb-6 relative">
      <div className="absolute inset-0 bg-red-700/20 blur-xl rounded-full"></div>
      <div className="relative w-16 h-16 bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg border border-red-500/50">
        <Icon className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-[280px]">
      {description}
    </p>
  </div>
);

const ShieldIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const SecurityFeatures = () => {
  return (
    <section className="bg-[#212121] py-20 sm:py-24 lg:py-32 px-4 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
            Enterprise-grade <span className="text-red-700">Security</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Built with the highest security standards for healthcare data protection and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          <SecurityItem 
            icon={ShieldIcon}
            title="HIPAA Compliant"
            description="Full compliance with healthcare data protection regulations and industry standards."
          />
          <SecurityItem 
            icon={CheckIcon}
            title="Audit Ready"
            description="Comprehensive audit trails and compliance reporting for seamless inspections."
          />
          <SecurityItem 
            icon={LockIcon}
            title="Data Encryption"
            description="End-to-end encryption for all patient and billing data at rest and in transit."
          />
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures;
