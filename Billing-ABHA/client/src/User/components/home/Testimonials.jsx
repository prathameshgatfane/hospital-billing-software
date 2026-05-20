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
  <div className={`relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group ${className} border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-700`}>
    <img 
      src={img} 
      alt={name} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-[#0F0F0F] dark:via-transparent dark:to-transparent opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity duration-500"></div>
    <div className="absolute bottom-3 left-3 right-3">
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="text-[10px] font-bold text-gray-900 dark:text-white tracking-widest uppercase block text-center truncate">{name}</span>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="relative bg-gray-50 dark:bg-[#212121] flex flex-col items-center justify-center overflow-hidden py-20 sm:py-24 lg:py-32 transition-colors duration-500">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-0"></div>

      <div className="w-full max-w-7xl mx-auto relative z-10 px-4 flex flex-col items-center">
        
        {/* Arching Grid of 13 Images */}
        <div className="flex items-start justify-center gap-4 md:gap-8 w-full overflow-hidden px-4 mb-20">
          
          {/* Col 1 (2 images) */}
          <div className="hidden lg:flex flex-col gap-6 mt-32 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[0].url} name={testimonialImages[0].name} className="h-40" />
            <TestimonialCard img={testimonialImages[1].url} name={testimonialImages[1].name} className="h-48" />
          </div>

          {/* Col 2 (2 images) */}
          <div className="hidden md:flex flex-col gap-6 mt-16 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[2].url} name={testimonialImages[2].name} className="h-52" />
            <TestimonialCard img={testimonialImages[3].url} name={testimonialImages[3].name} className="h-32" />
          </div>

          {/* Col 3 (2 images) */}
          <div className="flex flex-col gap-6 mt-0 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[4].url} name={testimonialImages[4].name} className="h-32" />
            <TestimonialCard img={testimonialImages[5].url} name={testimonialImages[5].name} className="h-60" />
          </div>

          {/* Col 4 - Center (1 image) */}
          <div className="flex flex-col gap-6 mt-20 flex-1 max-w-[240px] z-20">
            <TestimonialCard img={testimonialImages[6].url} name={testimonialImages[6].name} className="h-80 shadow-[0_0_50px_rgba(220,38,38,0.1)] dark:shadow-[0_0_50px_rgba(220,38,38,0.2)] border-black/20 dark:border-white/20" />
          </div>

          {/* Col 5 (2 images) */}
          <div className="flex flex-col gap-6 mt-0 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[7].url} name={testimonialImages[7].name} className="h-60" />
            <TestimonialCard img={testimonialImages[8].url} name={testimonialImages[8].name} className="h-32" />
          </div>

          {/* Col 6 (2 images) */}
          <div className="hidden md:flex flex-col gap-6 mt-16 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[9].url} name={testimonialImages[9].name} className="h-32" />
            <TestimonialCard img={testimonialImages[10].url} name={testimonialImages[10].name} className="h-52" />
          </div>

          {/* Col 7 (2 images) */}
          <div className="hidden lg:flex flex-col gap-6 mt-32 flex-1 max-w-[200px]">
            <TestimonialCard img={testimonialImages[11].url} name={testimonialImages[11].name} className="h-48" />
            <TestimonialCard img={testimonialImages[12].url} name={testimonialImages[12].name} className="h-40" />
          </div>

        </div>

        {/* Text Content */}
        <div className="relative z-30 text-center max-w-4xl mx-auto px-6">
          <div className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-6">Testimonials</div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tighter leading-[1.1] transition-colors duration-500">
            Trusted by leading clinics <br className="hidden sm:block" />
            <span className="text-gray-500 italic">and healthcare experts</span>
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-500">
            Learn why professionals trust Macvid to streamline their practice and complete their patient journeys.
          </p>
          
          <button className="group relative bg-[#212121] text-white dark:bg-white dark:text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-primary dark:hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 mx-auto tracking-widest uppercase overflow-hidden">
            <span className="relative z-10">Read Success Stories</span>
            <div className="relative z-10 w-8 h-8 rounded-full border border-white/20 dark:border-black/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-500">
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M21 12H3" />
              </svg>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
