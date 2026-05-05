import React, { useState } from 'react';

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
  </svg>
);

const FeaturedTestimonial = () => {
  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Administrator",
      hospital: "City Hospital, Amravati",
      initials: "RK",
      quote: "Mapvon reduced our billing processing time by 70% and improved accuracy by 95%. The implementation was seamless, and their support team is exceptional."
    },
    {
      name: "Priya Sharma",
      role: "Billing Manager",
      hospital: "Medicare Center",
      initials: "PS",
      quote: "Our claims processing is now 3x faster with automated validations. The mobile app allows our staff to handle billing on-the-go."
    },
    {
      name: "Amit Patel",
      role: "IT Director",
      hospital: "Lifeline Hospital",
      initials: "AP",
      quote: "Our revenue increased by 25% in the first quarter after implementing Mapvon. The analytics dashboard provides valuable insights."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[currentIndex];

  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-24 sm:py-32 px-6 sm:px-12 border-t border-gray-100 dark:border-white/5 transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 leading-[0.9]">
            Loved by clinics <br className="hidden sm:block" />
            <span className="text-[#C70000]">and hospitals worldwide.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
            Real feedback from real users who use our tool to stay productive and focused every day.
          </p>
        </div>

        {/* Carousel Area */}
        <div className="relative w-full max-w-4xl flex items-center justify-center py-20 px-4">
          
          {/* Stacked Cards Background Effect */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="absolute w-[85%] sm:w-[80%] aspect-[2/1] bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl rotate-[-3deg] translate-y-4 opacity-30"></div>
             <div className="absolute w-[85%] sm:w-[80%] aspect-[2/1] bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl rotate-[3deg] translate-y-2 opacity-30"></div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 sm:-left-12 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-[#1a1a1a] rounded-full border border-gray-200 dark:border-white/10 shadow-xl flex items-center justify-center text-gray-400 hover:text-[#C70000] hover:scale-110 transition-all duration-300"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-0 sm:-right-12 z-30 w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-[#1a1a1a] rounded-full border border-gray-200 dark:border-white/10 shadow-xl flex items-center justify-center text-gray-400 hover:text-[#C70000] hover:scale-110 transition-all duration-300"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Active Card */}
          <div className="relative z-20 w-full sm:w-[90%] bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] p-8 sm:p-16 border border-gray-200 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.3)] transition-all duration-500">
            <div className="flex flex-col gap-8">
              <p className="text-gray-900 dark:text-white text-xl sm:text-3xl font-bold italic leading-relaxed text-center">
                "{active.quote}"
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-[#C70000] font-black text-lg border border-gray-200 dark:border-white/10">
                  {active.initials}
                </div>
                <div className="text-center">
                  <h4 className="text-gray-900 dark:text-white font-black uppercase text-base sm:text-lg">{active.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">{active.role} • {active.hospital}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-bold uppercase tracking-[0.3em]">
            Join 500+ healthcare providers who track their focus daily.
          </p>
        </div>

      </div>
    </section>
  );
};

export default FeaturedTestimonial;
