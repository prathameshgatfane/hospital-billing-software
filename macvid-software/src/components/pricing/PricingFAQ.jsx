import React, { useState } from 'react';

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`rounded-xl mb-4 transition-all duration-300 border ${
      isOpen 
        ? 'bg-white dark:bg-[#1a1a1a] border-[#C70000]/50 shadow-lg' 
        : 'bg-white/50 dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
    }`}>
      <button
        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <span className={`text-base sm:text-lg font-bold pr-4 transition-colors duration-300 ${isOpen ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
          {question}
        </span>
        <span className={`flex-shrink-0 transition-colors duration-300 ${isOpen ? 'text-[#C70000]' : 'text-gray-500'}`}>
          {isOpen ? <CloseIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 sm:px-8 pb-6 text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 30-day free trial with full access to all Professional plan features."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking. For enterprise plans, we also accept bank transfers."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fee for any plan. Implementation and basic training are included with all subscriptions."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-24 sm:py-32 px-6 sm:px-12 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* Left Side: Big Text */}
          <div className="lg:w-1/3 w-full lg:sticky lg:top-32">
            <h2 className="text-[5rem] sm:text-[7rem] lg:text-[8rem] font-black text-[#C70000] tracking-tighter leading-none m-0">
              FAQs
            </h2>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:w-2/3 w-full">
            <div className="w-full">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
