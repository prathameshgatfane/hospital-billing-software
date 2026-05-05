import React from 'react';

const integrations = [
  {
    name: "Healthcode",
    description: "Streamline private medical billing with the leading healthcare clearing service.",
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-white rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <span className="font-bold text-white text-sm ml-1">healthcode</span>
      </div>
    )
  },
  {
    name: "Pipedrive",
    description: "Keep your acquisition pipeline for patients and clients organised from first enquiry to booked appointment.",
    logo: (
      <div className="flex items-center">
        <span className="font-black text-white text-lg">pipedrive</span>
      </div>
    )
  },
  {
    name: "Heidi",
    description: "Share clinical data securely and collaborate with multi-disciplinary care teams.",
    logo: (
      <div className="flex items-center">
        <span className="font-bold text-white text-xl tracking-tighter">heidi</span>
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
        <span className="font-black text-white text-sm">mailchimp</span>
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
        <span className="font-serif italic text-gray-200 text-lg">Signature</span>
        <span className="font-bold text-[#42B8D3] text-lg ml-1">Rx</span>
      </div>
    )
  },
  {
    name: "Pharmacierge",
    description: "Offer concierge medication delivery tailored to your patients' and clients' schedules.",
    logo: (
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest text-black">Pharmacierge</div>
        <div className="w-full h-[1px] bg-black mt-1"></div>
      </div>
    )
  },
  {
    name: "Nationwide Pathology",
    description: "Book phlebotomy services and receive accredited lab diagnostics from a trusted network.",
    logo: (
      <div className="flex items-center gap-1">
        <span className="font-black text-white text-xl">N</span>
        <div className="flex flex-col leading-none">
          <span className="text-[8px] font-bold text-white/60 uppercase">Nationwide</span>
          <span className="text-[10px] font-bold text-white uppercase">Pathology</span>
        </div>
      </div>
    )
  }
];

const Integrations = () => {
  return (
    <section className="bg-[#212121] py-24 px-4 md:px-12 lg:px-20 min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
            Connect Makwid with your go-to <br className="hidden md:block" /> clinical and business tools
          </h2>
          <p className="text-primary text-sm md:text-base font-bold mb-6 tracking-widest uppercase">
            Seamless ecosystems, powered by Makwid
          </p>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            From finance tools to AI-powered note taking and diagnostics, Makwid partners with trusted
            healthcare providers to keep your clinic running efficiently every single day.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {integrations.map((item, index) => (
            <div
              key={index}
              className="bg-red-700 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl hover:shadow-white/10 transition-all duration-500 group transform hover:-translate-y-2 hover:border-white/20"
            >
              {/* Logo Area */}
              <div className="h-16 flex items-center justify-center mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                {item.logo}
              </div>

              {/* Description */}
              <p className="text-white/90 text-sm font-medium leading-relaxed">
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
