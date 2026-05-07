import React from 'react';

const SolutionsHero = () => {
  return (
    <section className="bg-[#212121] pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
          Tailored Solutions for <br className="hidden sm:block" />
          <span className="text-[#C70000]">Every Healthcare Provider</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Customized billing solutions designed for different healthcare settings
        </p>
      </div>
    </section>
  );
};

export default SolutionsHero;
