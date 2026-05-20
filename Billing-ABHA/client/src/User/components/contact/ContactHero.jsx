import React from 'react';

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ContactCard = ({ title, icon: Icon, info1, info2, footer }) => (
  <div className="bg-[#C70000] rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center gap-6 shadow-2xl hover:scale-105 transition-all duration-300 group">
    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-white font-black uppercase tracking-widest text-lg">{title}</h3>
      <div className="flex flex-col gap-1">
        <p className="text-white font-bold text-base sm:text-lg">{info1}</p>
        {info2 && <p className="text-white/80 font-medium text-sm sm:text-base">{info2}</p>}
      </div>
    </div>
    <div className="mt-auto">
      <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] pt-4 border-t border-white/10 w-full px-4">
        {footer}
      </p>
    </div>
  </div>
);

const ContactHero = () => {
  const contactInfo = [
    {
      title: "Phone",
      icon: PhoneIcon,
      info1: "9021199661",
      info2: "+91 721 987 6543",
      footer: "Available 24/7 for urgent support"
    },
    {
      title: "Email",
      icon: EmailIcon,
      info1: "mapvon1@gmail.com",
      info2: "mapvon1@gmail.com",
      footer: "Response within 2 business hours"
    },
    {
      title: "Office",
      icon: LocationIcon,
      info1: "Tech Park, Amravati",
      info2: "Maharashtra 444601",
      footer: "Visit us by appointment"
    },
    {
      title: "Hours",
      icon: ClockIcon,
      info1: "Mon-Fri: 9AM - 6PM",
      info2: "Sat: 10AM - 2PM",
      footer: "Support available 24/7"
    }
  ];

  return (
    <section className="bg-gray-50 dark:bg-[#212121] pt-32 sm:pt-40 pb-16 px-4 sm:px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 leading-none">
            Get in <span className="text-[#C70000]">Touch</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            We're here to help with your hospital billing needs
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((card, index) => (
            <ContactCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
