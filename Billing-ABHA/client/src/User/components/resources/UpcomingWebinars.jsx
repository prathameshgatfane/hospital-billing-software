import React from 'react';

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const WebinarCard = ({ title, date, time, speaker, seatsAvailable, totalSeats }) => (
  <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-white/5 shadow-xl dark:shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:translate-y-[-4px] transition-all duration-300">
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-tight">{title}</h3>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-[10px] sm:text-sm">
          <CalendarIcon className="w-4 h-4 text-[#C70000]" />
          {date}
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-[10px] sm:text-sm">
          <ClockIcon className="w-4 h-4 text-[#C70000]" />
          {time}
        </div>
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium text-[10px] sm:text-sm">
          <UserIcon className="w-4 h-4 text-[#C70000]" />
          <span className="hidden sm:inline text-gray-400">Speaker:</span> {speaker}
        </div>
      </div>
    </div>

    <div className="flex flex-row items-center gap-6 sm:gap-12 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 dark:border-white/5 pt-4 sm:pt-0">
      <div className="flex flex-col items-start sm:items-end">
        <span className="text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Seats Available</span>
        <span className="text-gray-900 dark:text-white font-black text-base sm:text-lg">{seatsAvailable}/{totalSeats}</span>
      </div>
      <button className="bg-[#C70000] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-black transition-all duration-300 shadow-lg whitespace-nowrap">
        Register
      </button>
    </div>
  </div>
);

const UpcomingWebinars = () => {
  const webinars = [
    {
      title: "Advanced Billing Analytics",
      date: "Mar 15, 2024",
      time: "3:00 PM IST",
      speaker: "Dr. Rajesh Kumar",
      seatsAvailable: 45,
      totalSeats: 100
    },
    {
      title: "HIPAA Compliance Workshop",
      date: "Mar 22, 2024",
      time: "11:00 AM IST",
      speaker: "Legal Team",
      seatsAvailable: 28,
      totalSeats: 100
    },
    {
      title: "Mobile Billing Best Practices",
      date: "Mar 28, 2024",
      time: "2:00 PM IST",
      speaker: "Product Team",
      seatsAvailable: 67,
      totalSeats: 100
    }
  ];

  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-20 sm:py-24 lg:py-32 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#C70000]/10 rounded-xl flex items-center justify-center text-[#C70000]">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-tight">
              Upcoming <span className="text-[#C70000]">Webinars</span>
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium max-w-xl mx-auto">
            Join our live sessions and learn from experts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {webinars.map((webinar, index) => (
            <WebinarCard key={index} {...webinar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingWebinars;
