import React from 'react';

const integrations = [
  {
    name: "Healthcode",
    description: "Streamline private medical billing with the leading healthcare clearing service.",
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span className="font-bold text-gray-800 text-sm ml-1">healthcode</span>
      </div>
    )
  },
  {
    name: "Pipedrive",
    description: "Keep your acquisition pipeline for patients and clients organised from first enquiry to booked appointment.",
    logo: (
      <div className="flex items-center">
        <span className="font-black text-gray-900 text-lg">pipedrive</span>
      </div>
    )
  },
  {
    name: "Heidi",
    description: "Share clinical data securely and collaborate with multi-disciplinary care teams.",
    logo: (
      <div className="flex items-center">
        <span className="font-bold text-gray-900 text-xl tracking-tighter">heidi</span>
      </div>
    )
  },
  {
    name: "Xero",
    description: "Automate reconciliation, invoicing, and reporting with live financial data.",
    logo: (
      <div className="w-10 h-10 bg-[#13B5EA] rounded-full flex items-center justify-center text-white font-bold text-xs">xero</div>
    )
  },
  {
    name: "Mailchimp",
    description: "Stay connected with patients and clients through segmented marketing campaigns and automations.",
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px]">🐵</div>
        <span className="font-black text-gray-900 text-sm">mailchimp</span>
      </div>
    )
  },
  {
    name: "CloudRx",
    description: "Provide electronic prescriptions fulfilled by a trusted pharmacy partner.",
    logo: (
      <div className="flex items-center">
        <span className="font-bold text-[#42B8D3] text-xl">Cloud</span>
        <span className="font-light text-[#42B8D3] text-xl">Rx</span>
      </div>
    )
  },
  {
    name: "SignatureRx",
    description: "Issue private digital prescriptions with a fully compliant prescribing workflow.",
    logo: (
      <div className="flex items-center">
        <span className="font-serif italic text-gray-500 text-lg">Signature</span>
        <span className="font-bold text-[#42B8D3] text-lg ml-1">Rx</span>
      </div>
    )
  },
  {
    name: "Pharmacierge",
    description: "Offer concierge medication delivery tailored to your patients' and clients' schedules.",
    logo: (
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest text-gray-400">Pharmacierge</div>
        <div className="w-full h-[1px] bg-gray-200 mt-1"></div>
      </div>
    )
  },
  {
    name: "Nationwide Pathology",
    description: "Book phlebotomy services and receive accredited lab diagnostics from a trusted network.",
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-red-600 text-xl">N</span>
        <div className="flex flex-col leading-none">
          <span className="text-[8px] font-bold text-gray-400 uppercase">Nationwide</span>
          <span className="text-[10px] font-bold text-gray-800 uppercase">Pathology</span>
        </div>
      </div>
    )
  }
];

const Integrations = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Connect Macvid with your go-to <br className="hidden md:block" /> clinical and business tools
          </h2>
          <p className="text-primary text-sm md:text-base font-bold mb-4">
            Our trusted integrations keep your clinic running smoothly, connecting seamlessly with Macvid.
          </p>
          <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
            From finance tools to AI-powered note taking and diagnostics, Macvid partners with trusted 
            healthcare integration providers to keep your clinic running efficiently every single day.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
          {integrations.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-1"
            >
              {/* Logo Area */}
              <div className="h-12 flex items-center justify-center mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.logo}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
