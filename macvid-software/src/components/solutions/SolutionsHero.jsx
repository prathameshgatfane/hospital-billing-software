import React from 'react';

const SolutionsHero = () => {
  return (
    <section className="bg-[#212121] py-16 sm:py-24 px-6 sm:px-12 text-center">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
          Tailored Solutions for <br className="hidden sm:block" />
          <span className="text-[#C70000]">Every Healthcare Provider</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Customized billing solutions designed for different healthcare settings
        </p>
      </div>
    </section>
  );
};

export default SolutionsHero;
