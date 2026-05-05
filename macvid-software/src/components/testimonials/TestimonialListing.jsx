import React, { useState } from 'react';

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21L14.017 18C14.017 15.2386 16.2556 13 19.017 13H21V15H19.017C17.3601 15 16.017 16.3431 16.017 18V21H14.017ZM4.017 21L4.017 18C4.017 15.2386 6.2556 13 9.017 13H11V15H9.017C7.3601 15 6.017 16.3431 6.017 18V21H4.017Z" />
  </svg>
);

const TestimonialCard = ({ quote, name, role, hospital, initials, category, rating = 5 }) => (
  <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-6 group hover:translate-y-[-5px] transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 bg-[#C70000]/10 dark:bg-[#C70000]/20 rounded-xl flex items-center justify-center text-[#C70000]">
        <QuoteIcon className="w-6 h-6" />
      </div>
      <div className="flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        ))}
      </div>
    </div>

    <p className="text-gray-600 dark:text-gray-300 text-base italic leading-relaxed">
      "{quote}"
    </p>

    <div className="flex items-center gap-4 mt-2">
      <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-[#C70000] font-black text-sm border border-gray-200 dark:border-white/10 uppercase">
        {initials}
      </div>
      <div className="flex flex-col">
        <span className="text-gray-900 dark:text-white font-bold text-sm">{name}</span>
        <span className="text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
          {role} • {hospital}
        </span>
      </div>
    </div>

    <div className="mt-auto">
       <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-gray-100 dark:border-white/5">
        {category}
      </span>
    </div>
  </div>
);

const TestimonialListing = () => {
  const [activeTab, setActiveTab] = useState('All Testimonials');

  const tabs = [
    { name: 'All Testimonials', count: 6 },
    { name: 'Hospitals', count: 3 },
    { name: 'Clinics', count: 2 },
    { name: 'Diagnostics', count: 1 }
  ];

  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Chief Administrator",
      hospital: "City Hospital, Amravati",
      initials: "RK",
      category: "Hospitals",
      quote: "Mapvon reduced our billing processing time by 70% and improved accuracy by 95%. The implementation was seamless, and their support team is exceptional."
    },
    {
      name: "Priya Sharma",
      role: "Billing Manager",
      hospital: "Medicare Center",
      initials: "PS",
      category: "Clinics",
      quote: "Our claims processing is now 3x faster with automated validations. The mobile app allows our staff to handle billing on-the-go."
    },
    {
      name: "Amit Patel",
      role: "IT Director",
      hospital: "Lifeline Hospital",
      initials: "AP",
      category: "Hospitals",
      quote: "Our revenue increased by 25% in the first quarter after implementing Mapvon. The analytics dashboard provides valuable insights."
    },
    {
      name: "Dr. Sneha Deshmukh",
      role: "Owner",
      hospital: "Sneha Clinic",
      initials: "SD",
      category: "Clinics",
      quote: "As a small clinic, we needed an affordable solution. Mapvon's Basic plan is perfect for our needs. Very user-friendly!"
    },
    {
      name: "Rohit Verma",
      role: "Finance Head",
      hospital: "Metro Diagnostics",
      initials: "RV",
      category: "Diagnostics",
      quote: "The insurance integration has saved us countless hours. Claims are processed automatically with minimal errors."
    },
    {
      name: "Dr. Anjali Mehta",
      role: "Medical Superintendent",
      hospital: "Sahyadri Hospital",
      initials: "AM",
      category: "Hospitals",
      quote: "The role-based access control gives us peace of mind about data security. HIPAA compliance was a key factor in our decision."
    }
  ];

  const filteredTestimonials = activeTab === 'All Testimonials' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeTab);

  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-24 px-6 sm:px-12 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-4">
            Public <span className="text-[#C70000]">Cheers</span> for Us!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl mx-auto">
            Find out how our Subscribers are spreading the world!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 border ${
                activeTab === tab.name 
                  ? 'bg-[#C70000] text-white border-[#C70000] shadow-xl' 
                  : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-[#C70000]/30'
              }`}
            >
              {tab.name}
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
                activeTab === tab.name ? 'bg-white text-[#C70000]' : 'bg-gray-100 dark:bg-white/10 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-8">
            {filteredTestimonials.filter((_, i) => i % 3 === 0).map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>

          {/* Column 2 (Shifted down for masonry effect) */}
          <div className="flex flex-col gap-8 lg:mt-12">
            {filteredTestimonials.filter((_, i) => i % 3 === 1).map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-8">
            {filteredTestimonials.filter((_, i) => i % 3 === 2).map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialListing;
