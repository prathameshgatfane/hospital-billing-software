import React from 'react';

const ResourcesHero = () => {
  return (
    <section className="bg-gray-50 dark:bg-[#212121] pt-32 sm:pt-40 pb-16 px-4 sm:px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 leading-tight">
          Resources & <span className="text-[#C70000]">Support</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-medium">
          Everything you need to succeed with MacVid.
        </p>
      </div>
    </section>
  );
};

export default ResourcesHero;
