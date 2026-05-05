import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Solutions", path: "/solutions" },
    { name: "Pricing", path: "/pricing" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || isMenuOpen
          ? "bg-[#212121]/95 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
        }`}
    >
      {/* Top Utility Bar (Hidden on Mobile) */}
      <div
        className={`hidden md:block border-b transition-all duration-500 ${isScrolled ? "border-white/10 py-1" : "border-transparent py-2"
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex justify-end items-center gap-6 text-[11px] font-semibold tracking-wider uppercase">
          <a
            href="#"
            className={`hover:text-primary transition-colors ${isScrolled ? "text-white/80" : "text-white/80"
              }`}
          >
            Newsroom
          </a>
          <span className={isScrolled ? "text-white/20" : "text-white/20"}>|</span>
          <a
            href="#"
            className={`hover:text-primary transition-colors ${isScrolled ? "text-white/80" : "text-white/80"
              }`}
          >
            Makwid Blog
          </a>
          <span className={isScrolled ? "text-white/20" : "text-white/20"}>|</span>
          <a
            href="#"
            className={`hover:text-primary transition-colors ${isScrolled ? "text-white/80" : "text-white/80"
              }`}
          >
            Careers
          </a>
          <span className={isScrolled ? "text-white/20" : "text-white/20"}>|</span>
          <div
            className={`flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors ${isScrolled ? "text-white/80" : "text-white/80"
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
            </svg>
            <span>Asia Pacific - English</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            className={`flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors ${isScrolled ? "text-white/80" : "text-white/80"
              }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Login</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 relative z-50">
        <Link to="/" className="flex-shrink-0 group cursor-pointer">
          <img
            src={logo}
            alt="logo"
            className="h-10 sm:h-14 md:h-20 transition-all duration-500"
          />
        </Link>

        {/* Navigation Links */}
        <ul
          className={`hidden lg:flex items-center gap-5 text-[13px] font-bold tracking-[0.05em] ${isScrolled ? "text-white" : "text-white"
            }`}
        >
          {navItems.map((item) => (
            <li
              key={item.name}
              className="relative group cursor-pointer py-1 flex items-center gap-1"
            >
              <Link to={item.path} className="hover:text-primary transition-colors">{item.name}</Link>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </li>
          ))}
        </ul>

        {/* Search Bar & CTA */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="hidden md:block w-[150px] lg:w-[160px]">
            <div
              className={`relative flex items-center rounded-full px-3 py-1.5 border transition-all duration-500 ${isScrolled
                  ? "bg-white/5 border-white/10 focus-within:border-primary/30"
                  : "bg-white/10 border-white/20 focus-within:border-white/50"
                }`}
            >
              <input
                type="text"
                placeholder="Search"
                className={`bg-transparent outline-none text-xs w-full font-medium placeholder:transition-colors ${isScrolled
                    ? "text-white placeholder:text-white/40"
                    : "text-white placeholder:text-white/60"
                  }`}
              />
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-colors ${isScrolled ? "text-white/40" : "text-white/60"
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-white text-black text-[9px] sm:text-[11px] font-extrabold px-3 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-3 hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-xl hover:shadow-primary/10 active:scale-95 group whitespace-nowrap">
            <span className="hidden sm:inline">CONTACT MAKWID</span>
            <span className="sm:hidden">CONTACT</span>
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled || isMenuOpen ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
              }`}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-[#212121] z-[60] transition-all duration-500 lg:hidden ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-full invisible"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="logo" className="h-10" />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-72px)] px-6 py-6 overflow-y-auto">
          <ul className="flex flex-col gap-1 text-base font-bold text-white">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to={item.path} className="flex items-center justify-between py-3.5 cursor-pointer hover:text-primary transition-colors">
                  <span className="tracking-tight">{item.name}</span>
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 space-y-3">
            <button className="w-full py-3.5 border border-white/10 rounded-full font-bold text-white text-sm hover:bg-white/5 transition-colors tracking-wide">
              LOGIN
            </button>
            <button className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-sm hover:bg-primaryDark transition-colors shadow-lg tracking-wide">
              GET STARTED
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;