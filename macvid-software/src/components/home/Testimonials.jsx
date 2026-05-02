import React from 'react';

const testimonialImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300', name: 'Apex Medical' },
  { id: 2, url: 'https://images.unsplash.com/photo-1594824436998-d8ea3cf9a48e?auto=format&fit=crop&q=80&w=300', name: 'Nova Health' },
  { id: 3, url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300', name: 'City Dental' },
  { id: 4, url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300', name: 'CareFirst' },
  { id: 5, url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300', name: 'Sunrise Physio' },
  { id: 6, url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', name: 'Elite Vision' },
  { id: 7, url: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&q=80&w=300', name: 'Harmony Care' },
  { id: 8, url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300', name: 'Prime Clinic' },
  { id: 9, url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300', name: 'Urban Med' },
  { id: 10, url: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=300', name: 'Vitality Hub' },
  { id: 11, url: 'https://images.unsplash.com/photo-1590611936760-eeb9bcabe615?auto=format&fit=crop&q=80&w=300', name: 'Pioneer MD' },
  { id: 12, url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300', name: 'Cure All' },
  { id: 13, url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300', name: 'Serenity Med' },
];

const TestimonialCard = ({ img, name, className }) => (
  <div className={`relative rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl group ${className}`}>
    <img 
      src={img} 
      alt={name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 md:bottom-3 md:left-3 max-w-[85%]">
      <div className="bg-white/95 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1 rounded-md shadow-sm transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-gray-900 tracking-tight truncate block">{name}</span>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="relative bg-white h-[100vh] min-h-[600px] sm:min-h-[700px] max-h-[900px] flex flex-col items-center justify-between overflow-hidden pt-12 pb-8">
      
      {/* Background Vertical Dotted Lines */}
      <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-[0.12] z-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`w-px h-full border-l-2 border-dotted border-gray-400 ${i === 0 || i === 7 ? 'hidden md:block' : ''}`}></div>
        ))}
      </div>

      <div className="w-full max-w-[1600px] mx-auto relative z-10 px-2 sm:px-4 flex flex-col h-full items-center justify-center">
        
        {/* Arching Grid of 13 Images */}
        <div className="flex items-start justify-center gap-3 sm:gap-4 md:gap-6 w-full overflow-x-hidden sm:overflow-visible px-3 sm:px-2 snap-x hide-scrollbar mt-4 md:mt-8">
          
          {/* Col 1 (2 images) */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4 md:gap-6 mt-24 md:mt-32 flex-1 max-w-[200px] min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[0].url} name={testimonialImages[0].name} className="h-24 sm:h-32 md:h-40" />
            <TestimonialCard img={testimonialImages[1].url} name={testimonialImages[1].name} className="h-32 sm:h-40 md:h-48" />
          </div>

          {/* Col 2 (2 images) */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4 md:gap-6 mt-12 md:mt-16 flex-1 max-w-[200px] min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[2].url} name={testimonialImages[2].name} className="h-32 sm:h-40 md:h-52" />
            <TestimonialCard img={testimonialImages[3].url} name={testimonialImages[3].name} className="h-20 sm:h-24 md:h-32" />
          </div>

          {/* Col 3 (2 images — left stack on mobile) */}
          <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 mt-0 flex-1 min-w-0 max-w-[200px] sm:min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[4].url} name={testimonialImages[4].name} className="h-28 sm:h-24 md:h-32" />
            <TestimonialCard img={testimonialImages[5].url} name={testimonialImages[5].name} className="h-40 sm:h-48 md:h-60" />
          </div>

          {/* Col 4 - Center (1 image) */}
          <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 mt-16 sm:mt-20 md:mt-28 flex-1 min-w-0 max-w-[220px] sm:min-w-[120px] snap-center z-20">
            <TestimonialCard img={testimonialImages[6].url} name={testimonialImages[6].name} className="h-48 sm:h-56 md:h-72 shadow-2xl border-4 border-white" />
          </div>

          {/* Col 5 (2 images — right stack on mobile) */}
          <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 mt-0 flex-1 min-w-0 max-w-[200px] sm:min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[7].url} name={testimonialImages[7].name} className="h-40 sm:h-48 md:h-60" />
            <TestimonialCard img={testimonialImages[8].url} name={testimonialImages[8].name} className="h-28 sm:h-24 md:h-32" />
          </div>

          {/* Col 6 (2 images) */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4 md:gap-6 mt-12 md:mt-16 flex-1 max-w-[200px] min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[9].url} name={testimonialImages[9].name} className="h-20 sm:h-24 md:h-32" />
            <TestimonialCard img={testimonialImages[10].url} name={testimonialImages[10].name} className="h-32 sm:h-40 md:h-52" />
          </div>

          {/* Col 7 (2 images) */}
          <div className="hidden sm:flex flex-col gap-2 sm:gap-4 md:gap-6 mt-24 md:mt-32 flex-1 max-w-[200px] min-w-[100px] snap-center">
            <TestimonialCard img={testimonialImages[11].url} name={testimonialImages[11].name} className="h-32 sm:h-40 md:h-48" />
            <TestimonialCard img={testimonialImages[12].url} name={testimonialImages[12].name} className="h-24 sm:h-32 md:h-40" />
          </div>

        </div>

        {/* Text Content - Pulled up tightly with negative margin */}
        <div className="relative z-30 text-center max-w-3xl mx-auto px-4 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
          
          <div className="absolute inset-0 bg-white/95 blur-xl -z-10 h-[150%] -top-[20%] rounded-[100%] pointer-events-none"></div>

          <div className="relative z-10 inline-block bg-white text-gray-800 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-4 sm:mb-6 border border-gray-100 shadow-sm">
            Testimonials
          </div>
          
          <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight">
            Trusted by leading clinics <br className="hidden sm:block" />
            <span className="text-gray-400">and healthcare experts</span>
          </h2>
          
          <p className="relative z-10 text-gray-500 font-medium text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Learn why professionals trust Macvid to streamline their practice and complete their patient journeys.
          </p>
          
          <button className="relative z-10 bg-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 mx-auto">
            Read Success Stories
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M21 12H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
