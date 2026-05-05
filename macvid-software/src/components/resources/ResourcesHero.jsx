import React from 'react';

const ResourcesHero = () => {
  return (
    <section className="bg-gray-50 dark:bg-[#212121] pt-24 sm:pt-32 pb-16 px-6 sm:px-12 text-center transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-6 leading-tight">
          Resources & <span className="text-[#C70000]">Support</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium max-w-xl mx-auto">
          Everything you need to succeed with MacVid.
        </p>
      </div>
    </section>
  );
};

export default ResourcesHero;
