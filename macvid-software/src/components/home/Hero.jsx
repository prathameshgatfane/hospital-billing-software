import LoginForm from "./LoginForm";
import heroBg from "../../assets/hero-bg.png"; 

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Image / Future Video */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Healthcare Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
      </div>

      {/* Content Container — Bottom Aligned */}
      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-8 md:px-16 w-full pb-10 sm:pb-14 md:pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 sm:gap-8 lg:gap-12">
          
          {/* Left Side: Bottom-Left Info */}
          <div className="flex-1 w-full max-w-2xl">
            <span className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3 block">
              Advanced Billing Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              Register your <br className="hidden sm:block" />
              hospital clinic <br className="hidden sm:block" />
              now!
            </h1>
            
            {/* Pill shaped action bar */}
            <div className="flex items-center bg-white p-1 sm:p-1.5 rounded-full shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md">
              <div className="px-3 sm:px-4 text-primary font-bold text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 border-r border-gray-200 whitespace-nowrap">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                My Clinic
              </div>
              <input 
                type="text" 
                placeholder="Enter clinic name" 
                className="flex-1 bg-transparent outline-none text-dark font-medium placeholder:text-gray-400 px-2 sm:px-4 text-xs sm:text-sm min-w-0"
              />
              <button className="bg-primary text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side: Expandable Login/Signup Cards */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <LoginForm />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;