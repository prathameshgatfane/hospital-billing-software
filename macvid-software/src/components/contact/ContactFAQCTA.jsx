import React from 'react';
import { Link } from 'react-router-dom';

const ContactFAQCTA = () => {
  return (
    <section className="bg-white dark:bg-[#C70000] py-24 sm:py-32 px-6 transition-colors duration-500 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
          Quick Questions?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium mb-12">
          Check our FAQ section for quick answers to common questions
        </p>
        <Link
          to="/resources"
          className="inline-block bg-[#1a1a1a] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95"
        >
          Visit FAQ Page
        </Link>
      </div>
    </section>
  );
};

export default ContactFAQCTA;
