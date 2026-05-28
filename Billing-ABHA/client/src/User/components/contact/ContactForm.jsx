import React, { useState } from 'react';
import logo from "../../assets/logo.png";

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const UnderlineInput = ({ placeholder, type = "text" }) => (
  <div className="w-full border-b border-white/30 py-3 focus-within:border-white transition-colors duration-300">
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border-none text-white placeholder-white/60 focus:ring-0 focus:outline-none text-lg font-medium"
    />
  </div>
);

const InfoBlock = ({ icon: Icon, title, text, link }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-white flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-1">{text}</p>
      {link && <p className="text-gray-900 dark:text-white font-black text-sm">{link}</p>}
    </div>
  </div>
);

const ContactForm = () => {
  return (
    <section className="bg-gray-50 dark:bg-[#212121] py-16 sm:py-20 lg:py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-gray-200 dark:border-white/5 overflow-hidden shadow-2xl flex flex-col lg:row lg:flex-row transition-all duration-500 min-h-[700px]">
          
          {/* Left Column: Info & Sidebar */}
          <div className="w-full lg:w-[450px] p-8 sm:p-16 flex flex-col justify-between">
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Makwid" className="h-10 sm:h-12 w-auto object-contain" />
                <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Makwid</span>
              </div>

              <div className="flex flex-col gap-10">
                <InfoBlock 
                  icon={EmailIcon} 
                  title="Chat to us" 
                  text="Our friendly team is here to help." 
                  link="makvid1@gmail.com" 
                />
                <InfoBlock 
                  icon={LocationIcon} 
                  title="Visit us" 
                  text="Come say hello at our office HQ." 
                  link="Tech Park, Amravati, MH 444601" 
                />
                <InfoBlock 
                  icon={PhoneIcon} 
                  title="Call us" 
                  text="Available 24/7 for urgent support." 
                  link="9021199661" 
                />
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <FacebookIcon className="w-5 h-5 text-gray-400 hover:text-[#C70000] cursor-pointer transition-colors" />
              <TwitterIcon className="w-5 h-5 text-gray-400 hover:text-[#C70000] cursor-pointer transition-colors" />
              <LinkedInIcon className="w-5 h-5 text-gray-400 hover:text-[#C70000] cursor-pointer transition-colors" />
              <InstagramIcon className="w-5 h-5 text-gray-400 hover:text-[#C70000] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Right Column: Red Form (Exactly as per Screenshot) */}
          <div className="flex-1 bg-[#C70000] p-8 sm:p-16 flex flex-col">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight mb-4">
                Got ideas? We've got the skills. Let's team up.
              </h2>
              <p className="text-white/80 text-lg mb-12">
                Tell us more about yourself and what you're got in mind.
              </p>

              <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                <UnderlineInput placeholder="Your name" />
                <UnderlineInput placeholder="you@company.com" type="email" />
                <UnderlineInput placeholder="Tell us a little about the project..." />

                <div className="flex flex-col gap-6 mt-4">
                  <p className="text-white font-black uppercase tracking-widest text-xs">How can we help?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Website design', 'Content creation', 
                      'UX design', 'Strategy & consulting',
                      'User research', 'Other'
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 border-2 border-white/40 rounded flex items-center justify-center group-hover:border-white transition-colors">
                          <div className="w-2.5 h-2.5 bg-white scale-0 checked:scale-100 transition-transform"></div>
                          <input type="checkbox" className="hidden" />
                        </div>
                        <span className="text-white text-sm font-bold">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="bg-black text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs mt-8 hover:bg-white hover:text-black transition-all duration-300 shadow-2xl">
                  Let's get started!
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;
