import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ScrollTrigger } from "gsap/all";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const NewHero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const totalVideos = 4;
  const currentVideoRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Mouse tracking for cursor follower - throttled for better performance
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    // Throttle mouse movement updates
    let ticking = false;
    const throttledMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", throttledMouseMove);
    return () => window.removeEventListener("mousemove", throttledMouseMove);
  }, [handleMouseMove]);

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles using RAF for better performance
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Wrap around screen edges
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };

    animationFrameRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleVideoLoad = useCallback(() => {
    setLoadedVideos((prev) => prev + 1);
  }, []);

  // Auto-loop videos every 5 seconds
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex >= totalVideos ? 1 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLoading, totalVideos]);

  useEffect(() => {
    if (loadedVideos === totalVideos) {
      setIsLoading(false);
    }
  }, [loadedVideos, totalVideos]);

  // Handle video ended event to immediately switch to next video
  const handleVideoEnded = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalVideos ? 1 : prevIndex + 1
    );
  }, [totalVideos]);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  // Handle button clicks
  const handleAboutClick = () => {
    // Smooth scroll to about section
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDownloadCV = () => {
    const link = document.createElement("a");
    link.href = "/cv/Shubham-Kumar-Mahato-CV.pdf";
    link.download = "Shubham-Kumar-Mahato-CV.pdf";
    link.click();
  };

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* Cursor Follower */}
      <div
        className="cursor-follower"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}

      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div className="relative w-full h-full">
          <video
            key={currentIndex}
            ref={currentVideoRef}
            src={getVideoSrc(currentIndex)}
            autoPlay
            muted
            playsInline
            id="current-video"
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
            onEnded={handleVideoEnded}
            preload="metadata"
          />

          {/* Video Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

          {/* Preload other videos */}
          {Array.from({ length: totalVideos }, (_, i) => i + 1)
            .filter((index) => index !== currentIndex)
            .map((index) => (
              <video
                key={index}
                src={getVideoSrc(index)}
                muted
                preload="metadata"
                className="hidden"
                onLoadedData={handleVideoLoad}
              />
            ))}
        </div>

        {/* Center Text Content */}
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="text-center px-4 max-w-4xl">
            <p className="hero-name-text text-yellow-300 text-sm md:text-base font-light tracking-[0.3em] mb-8 uppercase">
              Shubham Kumar Mahato
            </p>

            <h1 className="hero-main-text-clean special-font font-black leading-[0.85] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-12">
              <b>Thoughtfully</b><br />
              Built,<br />
              <b>Visually</b><br />
              Brilliant!
            </h1>

            {/* Button Group */}
            <div className="flex justify-center gap-6 flex-wrap">
              <Button
                id="about-me"
                title="About Me"
                containerClass="text-white border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
                onClick={handleAboutClick}
              />
              <Button
                id="download-cv"
                title="Download CV"
                containerClass="text-yellow-300 border-yellow-300 bg-transparent hover:bg-yellow-300 hover:text-black transition-all duration-300"
                onClick={handleDownloadCV}
              />
            </div>
          </div>
        </div>

        {/* Video Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex space-x-3">
            {Array.from({ length: totalVideos }, (_, i) => i + 1).map(
              (index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-10 h-1 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === index
                      ? "bg-yellow-300 shadow-lg shadow-yellow-300/50"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Switch to video ${index}`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHero;