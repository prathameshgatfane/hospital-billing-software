import React from 'react';
import logo from "../../assets/logo.png";

const Footer = () => {
  const footerLinks = [
    {
      title: "Products",
      links: ["Billing Software", "Invoice Management", "Payment Tracking", "Patient Records", "Reports & Analytics"]
    },
    {
      title: "Solutions",
      links: ["Hospitals", "Clinics", "Laboratories", "Pharmacies", "Multi-location"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Newsroom", "Partners"]
    },
    {
      title: "Support",
      links: ["Help Center", "Documentation", "Contact Us", "FAQs", "System Status"]
    }
  ];

  return (
    <footer className="bg-dark text-white relative overflow-hidden pt-16 pb-32 sm:pb-40">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Macvid" className="h-14 md:h-20 mb-6" />
            <p className="text-white/70 text-sm md:text-base max-w-xs leading-relaxed mb-8 font-medium">
              Simplifying hospital billing & clinic management across India with state-of-the-art technology.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              {['linkedin', 'twitter', 'facebook', 'instagram'].map((social) => (
                <a key={social} href="#" className="text-white/50 hover:text-primary transition-all duration-300 transform hover:scale-110">
                  <div className="w-5 h-5 capitalize">
                    {/* Placeholder for actual icons, using text labels for now */}
                    <span className="text-[10px] font-bold border border-white/20 p-1 rounded uppercase tracking-tighter">
                      {social.substring(0, 2)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 text-sm font-medium hover:text-primary transition-colors duration-300 block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-[10px] sm:text-xs font-medium tracking-wide">
            © 2025 MAKWID SOFTWARE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs font-medium">
            <span>MADE WITH</span>
            <span className="text-primary animate-pulse">❤️</span>
            <span>BY CLICK INNOVATE PVT LTD</span>
          </div>
        </div>
      </div>

      {/* Hospital/Billing Cityscape SVG Strip (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path fill="#DC2626" d="M0 120h1200V80c-50-5-100-20-150-15s-100 25-150 20-100-30-150-25-100 25-150 20-100-30-150-25-100 25-150 20-100-30-150-25V120z" />

          {/* Stylized Buildings */}
          <rect x="50" y="40" width="40" height="60" fill="#DC2626" /> {/* Hospital Main */}
          <rect x="65" y="55" width="10" height="10" fill="white" opacity="0.3" /> {/* Window */}
          <path d="M55 35h30v5H55z" fill="#DC2626" /> {/* Roof line */}
          <path d="M68 25v15M60 32h16" stroke="white" strokeWidth="2" opacity="0.6" /> {/* Cross */}

          <rect x="150" y="60" width="30" height="40" fill="#DC2626" /> {/* Clinic */}
          <rect x="220" y="50" width="35" height="50" fill="#DC2626" /> {/* Lab */}

          {/* Data Lines/Nodes */}
          <circle cx="400" cy="50" r="3" fill="#DC2626" />
          <circle cx="450" cy="30" r="2" fill="#DC2626" />
          <path d="M400 50L450 30" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 2" />

          <rect x="600" y="40" width="25" height="35" fill="#DC2626" /> {/* Invoice icon shape */}
          <path d="M605 50h15M605 60h10" stroke="white" strokeWidth="1" opacity="0.5" />

          <rect x="900" y="30" width="45" height="70" fill="#DC2626" /> {/* Hospital 2 */}
          <path d="M918 15v15M910 22h16" stroke="white" strokeWidth="2" opacity="0.6" /> {/* Cross */}

          <path fill="#B91C1C" d="M0 120h1200v-20c-60 5-120 15-180 10s-120-20-180-15-120 15-180 10-120-20-180-15-120 15-180 10-120-20-180-15V120z" />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
