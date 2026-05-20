import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);

  const videos = [
    {
      src: "https://s7d1.scene7.com/is/content/kyndryl/connection-is-resilience-header-video-16x9",
      mirror: false
    },
    {
      src: "https://s7d1.scene7.com/is/content/kyndryl/agerntic-ai-mainframe-solution-16x9-looped",
      mirror: true
    },
    {
      src: "https://s7d1.scene7.com/is/content/kyndryl/Clip_202",
      mirror: false
    }
  ];

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    
    if (currentVideo) {
      const playPromise = currentVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Ignore AbortError as it's a normal occurrence during unmount/navigation/strict-mode
          if (error.name !== "AbortError") {
            console.warn("Autoplay prevented:", error);
          }
        });
      }
    }

    // Pause other videos to save resources
    videoRefs.current.forEach((video, index) => {
      if (index !== currentVideoIndex && video) {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  const stats = [
    { label: "Success Rate", value: "98.7%", color: "text-green-400" },
    { label: "Faster Processing", value: "70%", color: "text-blue-400" },
    { label: "Revenue Managed", value: "₹2.4Cr+", color: "text-primary" },
    { label: "Support", value: "24/7", color: "text-purple-400" }
  ];

  return (
    <div className="relative min-h-[800px] lg:min-h-screen flex items-center overflow-hidden bg-black pt-32 lg:pt-40">
      {/* Background Video Carousel */}
      <div className="absolute inset-0 z-0">
        {videos.map((vid, index) => (
          <video
            key={vid.src}
            ref={el => videoRefs.current[index] = el}
            muted
            playsInline
            preload="auto"
            onEnded={index === currentVideoIndex ? handleVideoEnd : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${vid.mirror ? 'scale-x-[-1]' : ''}`}
          >
            <source src={vid.src} type="video/mp4" />
          </video>
        ))}
        {/* Dark Overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>

        {/* Massive Background Text - Matching "BUILDIN" in screenshot */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden">
          <h1 className="text-[20vw] font-black text-white/[0.08] leading-none tracking-tighter uppercase whitespace-nowrap select-none">
            MAKWID
          </h1>
        </div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT SIDE: Content */}
          <div className="lg:col-span-7 flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 backdrop-blur-md rounded-full w-fit shadow-sm">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                Amravati's First Modern Billing Software
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tighter">
                Transform Your <br />
                <span className="text-primary">Hospital Billing</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                Secure, compliant billing software designed for modern healthcare systems.
                Manage invoices, payments, and reports efficiently.
              </p>
            </div>

            {/* CTA Buttons - Rectangular as per screenshot */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
              <Link to="/contact" className="px-6 sm:px-10 py-3.5 sm:py-5 bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-widest transition-all hover:bg-primary hover:text-white border-2 border-white text-center">
                Let's Connect
              </Link>
              <Link to="/register" className="px-6 sm:px-10 py-3.5 sm:py-5 bg-transparent text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-black border-2 border-white text-center">
                Get Started
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Simplified Login Card */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative z-10 w-full max-w-[400px] transform hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
              {/* Added a subtle glow behind the glassy form */}
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full z-0"></div>
              <div className="relative z-10">
                <LoginForm />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;