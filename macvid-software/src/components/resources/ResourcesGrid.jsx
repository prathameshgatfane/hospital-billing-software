import React from 'react';

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const DocIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const VideoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CaseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ResourceItem = ({ title, subtitle, meta }) => (
  <button className="w-full text-left p-6 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 border-b border-gray-100 dark:border-white/5 last:border-0 first:rounded-t-3xl last:rounded-b-3xl">
    <div className="flex flex-col">
      <h4 className="text-gray-900 dark:text-white font-bold text-base sm:text-lg mb-1">{title}</h4>
      <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2">{subtitle}</p>
      <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">{meta}</span>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#C70000] group-hover:text-white transition-all duration-300 transform group-hover:scale-110 shadow-lg">
      <DownloadIcon className="w-5 h-5" />
    </div>
  </button>
);

const ResourceSection = ({ title, icon: Icon, items }) => (
  <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col h-full transition-all duration-500">
    <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
      <div className="w-12 h-12 bg-[#C70000]/10 rounded-xl flex items-center justify-center text-[#C70000]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
    </div>
    <div className="flex-1">
      {items.map((item, index) => (
        <ResourceItem key={index} {...item} />
      ))}
    </div>
  </div>
);

const ResourcesGrid = () => {
  const resourceData = [
    {
      title: "Documentation",
      icon: DocIcon,
      items: [
        { title: "User Guide", subtitle: "Complete guide to using MacVid", meta: "PDF • 2.4 MB" },
        { title: "API Documentation", subtitle: "Integration guide for developers", meta: "PDF • 1.8 MB" },
        { title: "Compliance Handbook", subtitle: "HIPAA and regulatory guidelines", meta: "PDF • 3.2 MB" },
        { title: "Best Practices", subtitle: "Optimizing billing workflows", meta: "Article • 15 min read" }
      ]
    },
    {
      title: "Video Tutorials",
      icon: VideoIcon,
      items: [
        { title: "Getting Started", subtitle: "Setup and basic configuration", meta: "Video • 12:45" },
        { title: "Billing Workflow", subtitle: "Complete billing process tutorial", meta: "Video • 25:30" },
        { title: "Reports & Analytics", subtitle: "Using the dashboard effectively", meta: "Video • 18:15" },
        { title: "Mobile App Guide", subtitle: "Using MacVid on mobile devices", meta: "Video • 14:20" }
      ]
    },
    {
      title: "Case Studies",
      icon: CaseIcon,
      items: [
        { title: "City Hospital", subtitle: "70% faster billing processing", meta: "Case Study • 8 pages" },
        { title: "Medicare Center", subtitle: "Automated insurance claims", meta: "Case Study • 6 pages" },
        { title: "Metro Diagnostics", subtitle: "Revenue growth analysis", meta: "Case Study • 10 pages" },
        { title: "Sneha Clinic", subtitle: "Small practice transformation", meta: "Case Study • 5 pages" }
      ]
    }
  ];

  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-16 sm:py-20 lg:py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceData.map((section, index) => (
            <ResourceSection key={index} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesGrid;
