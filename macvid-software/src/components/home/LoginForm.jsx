import { useState, useRef, useEffect } from "react";

const LoginForm = () => {
  const [activeCard, setActiveCard] = useState(null); // null | 'login' | 'signup'
  const [hoveredCard, setHoveredCard] = useState(null); // null | 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const containerRef = useRef(null);

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveCard(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isExpanded = (card) => activeCard === card || (hoveredCard === card && activeCard === null);

  const handleCardClick = (card) => {
    if (activeCard === card) return; // already open
    setActiveCard(card);
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setActiveCard(null);
  };

  return (
    <div ref={containerRef} className="flex gap-3 sm:gap-4 items-end">
      {/* Login Card */}
      <div
        className={`relative rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl cursor-pointer
          bg-white/10 backdrop-blur-md
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
          ${isExpanded("login")
            ? "w-[240px] sm:w-[340px] md:w-[380px] p-5 sm:p-7 md:p-8"
            : "w-[80px] sm:w-[150px] md:w-[170px] p-3 sm:p-5 md:p-6"
          }
          ${activeCard === "signup" ? "opacity-60 scale-95" : "opacity-100 scale-100"}
          hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
        `}
        onMouseEnter={() => setHoveredCard("login")}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick("login")}
      >
        {/* Close Button */}
        {activeCard === "login" && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
              flex items-center justify-center text-white/60 hover:text-white transition-all z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Collapsed State */}
        <div className={`transition-all duration-500 ${isExpanded("login") ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
          <div className="flex flex-col items-center gap-2 sm:gap-4 py-4 sm:py-6">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xs sm:text-base tracking-wide">Login</span>
            <div className="hidden sm:block w-8 h-0.5 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Expanded State — Login Form */}
        <div className={`transition-all duration-500 ${isExpanded("login") ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-2xl font-bold text-white">Welcome Back</h3>
            <p className="text-white/50 text-[10px] sm:text-sm mt-1">Sign in to your account</p>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-sm outline-none 
                  focus:border-white/40 transition-all placeholder:text-white/40 text-white font-medium
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] focus:bg-black/30"
                required
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-sm outline-none 
                  focus:border-white/40 transition-all placeholder:text-white/40 text-white font-medium
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] focus:bg-black/30"
                required
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-[0.15em] py-3 sm:py-3.5 rounded-xl
                hover:bg-gray-100 transition-all shadow-[0_8px_20px_-8px_rgba(255,255,255,0.3)]
                hover:shadow-[0_8px_30px_-5px_rgba(255,255,255,0.4)] transform hover:scale-[1.02] active:scale-95"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-white/40 text-[10px] sm:text-xs mt-3 sm:mt-4">
            Forgot password? <span className="text-white/60 hover:text-white cursor-pointer underline">Reset here</span>
          </p>
        </div>
      </div>

      {/* Sign Up Card */}
      <div
        className={`relative rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl cursor-pointer
          bg-white/10 backdrop-blur-md
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
          ${isExpanded("signup")
            ? "w-[240px] sm:w-[340px] md:w-[380px] p-5 sm:p-7 md:p-8"
            : "w-[80px] sm:w-[150px] md:w-[170px] p-3 sm:p-5 md:p-6"
          }
          ${activeCard === "login" ? "opacity-60 scale-95" : "opacity-100 scale-100"}
          hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
        `}
        onMouseEnter={() => setHoveredCard("signup")}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleCardClick("signup")}
      >
        {/* Close Button */}
        {activeCard === "signup" && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
              flex items-center justify-center text-white/60 hover:text-white transition-all z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Collapsed State */}
        <div className={`transition-all duration-500 ${isExpanded("signup") ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
          <div className="flex flex-col items-center gap-2 sm:gap-4 py-4 sm:py-6">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xs sm:text-base tracking-wide">Sign Up</span>
            <div className="hidden sm:block w-8 h-0.5 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Expanded State — Signup Form */}
        <div className={`transition-all duration-500 ${isExpanded("signup") ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-2xl font-bold text-white">Get Started</h3>
            <p className="text-white/50 text-[10px] sm:text-sm mt-1">Create your free account</p>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-sm outline-none 
                  focus:border-white/40 transition-all placeholder:text-white/40 text-white font-medium
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] focus:bg-black/30"
                required
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-sm outline-none 
                  focus:border-white/40 transition-all placeholder:text-white/40 text-white font-medium
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] focus:bg-black/30"
                required
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-sm outline-none 
                  focus:border-white/40 transition-all placeholder:text-white/40 text-white font-medium
                  shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] focus:bg-black/30"
                required
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-[0.15em] py-3 sm:py-3.5 rounded-xl
                hover:bg-gray-100 transition-all shadow-[0_8px_20px_-8px_rgba(255,255,255,0.3)]
                hover:shadow-[0_8px_30px_-5px_rgba(255,255,255,0.4)] transform hover:scale-[1.02] active:scale-95"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-white/40 text-[10px] sm:text-xs mt-3 sm:mt-4">
            By signing up, you agree to our <span className="text-white/60 hover:text-white cursor-pointer underline">Terms</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
