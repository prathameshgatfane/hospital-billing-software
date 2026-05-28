import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useTheme } from "../../../Common/context/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isHome = location.pathname === "/" || location.pathname === "/billing-software";
  const useDarkThemeNavbar = isHome && !isScrolled && !isMenuOpen;


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
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          useDarkThemeNavbar ? "nav-force-dark-theme " : ""
        }${isScrolled || isMenuOpen
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
            <a href="#" className="hover:text-primary transition-colors text-white/80">Newsroom</a>
            <span className="text-white/20">|</span>
            <a href="#" className="hover:text-primary transition-colors text-white/80">Makwid Blog</a>
            <span className="text-white/20">|</span>
            <a href="#" className="hover:text-primary transition-colors text-white/80">Careers</a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors text-white/80">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
              </svg>
              <span>Asia Pacific - English</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <Link to="/login" className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors text-white/80">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Login</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/register" className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors text-white/80">
              <span>Register</span>
            </Link>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <Link to="/" className="flex-shrink-0 group cursor-pointer">
            <img src={logo} alt="logo" className="h-10 sm:h-14 md:h-20 transition-all duration-500" />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-5 text-[13px] font-bold tracking-[0.05em] text-white">
            {navItems.map((item) => (
              <li key={item.name} className="relative group cursor-pointer py-1 flex items-center gap-1">
                <Link to={item.path} className="hover:text-primary transition-colors">{item.name}</Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* Search Bar & CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-[150px] lg:w-[160px]">
              <div className={`relative flex items-center rounded-full px-3 py-1.5 border transition-all duration-500 ${isScrolled ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20"}`}>
                <input type="text" placeholder="Search" className="bg-transparent outline-none text-xs w-full font-medium text-white placeholder:text-white/40" />
                <svg className="w-4 h-4 flex-shrink-0 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button className="bg-white text-black text-[9px] sm:text-[11px] font-extrabold px-3 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-3 hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-xl group whitespace-nowrap">
              <span className="hidden sm:inline">CONTACT MAKWID</span>
              <span className="sm:hidden">CONTACT</span>
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white flex items-center justify-center"
              style={{ width: 36, height: 36 }}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10"
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
      </nav>

      {/* Mobile Menu Drawer - MOVED OUTSIDE NAV FOR PROPER STACKING */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-500 ${isMenuOpen ? "visible" : "invisible pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Content Container */}
        <div
          className={`absolute top-0 right-0 w-full h-full bg-[#1a1a1a] shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img src={logo} alt="logo" className="h-10 sm:h-12" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col h-[calc(100%-80px)] px-6 py-8 overflow-y-auto">
            <div className="mb-10">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Navigation</p>
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.name} onClick={() => setIsMenuOpen(false)}>
                    <Link 
                      to={item.path} 
                      className="group flex items-center justify-between py-4 border-b border-white/5 cursor-pointer"
                    >
                      <span className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-8 space-y-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full block text-center py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                Client Login
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full block text-center py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primaryDark transition-all active:scale-95 shadow-xl shadow-primary/20">
                Register Hospital
              </Link>
              
              <div className="pt-6 text-center">
                <p className="text-white/20 text-[10px] font-medium tracking-widest">© 2025 MAKWID SOFTWARE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;